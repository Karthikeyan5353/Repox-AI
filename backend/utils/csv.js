import { Parser } from 'json2csv';

export function convertToCsv(rows, fields) {
  const parser = new Parser({ fields });
  return parser.parse(rows);
}
