export function parsePatch(patch = '') {
  const lines = patch.split('\n');
  const hunks = [];
  let current = null;
  let oldLine = 0;
  let newLine = 0;

  for (const rawLine of lines) {
    const line = rawLine ?? '';
    const match = line.match(/^@@ -(\d+),?(\d*) \+(\d+),?(\d*) @@/);

    if (match) {
      if (current) {
        hunks.push(current);
      }

      oldLine = Number(match[1]);
      newLine = Number(match[3]);
      current = {
        header: line,
        lines: [],
      };
      continue;
    }

    if (!current) {
      continue;
    }

    const type = line.startsWith('+') ? 'add' : line.startsWith('-') ? 'remove' : 'context';
    const entry = {
      type,
      content: line,
      oldLine: type === 'add' ? null : oldLine,
      newLine: type === 'remove' ? null : newLine,
    };

    current.lines.push(entry);

    if (type !== 'add') {
      oldLine += 1;
    }

    if (type !== 'remove') {
      newLine += 1;
    }
  }

  if (current) {
    hunks.push(current);
  }

  return hunks;
}

export function buildDiffLookup(files = []) {
  const lookup = new Map();

  for (const file of files) {
    const lineNumbers = new Set();

    for (const hunk of parsePatch(file.patch || '')) {
      for (const line of hunk.lines) {
        if (line.type === 'add' && line.newLine) {
          lineNumbers.add(line.newLine);
        }
      }
    }

    lookup.set(file.filename, lineNumbers);
  }

  return lookup;
}
