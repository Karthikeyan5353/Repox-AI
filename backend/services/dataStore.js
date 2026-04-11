import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../data');
const storePath = path.join(dataDir, 'store.json');

const defaultStore = {
  settings: [],
  repositories: [],
  pullRequests: [],
  reviews: [],
  learnings: [],
};

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });

  try {
    await fs.access(storePath);
  } catch {
    await fs.writeFile(storePath, JSON.stringify(defaultStore, null, 2), 'utf8');
  }
}

async function readStore() {
  await ensureStore();
  const raw = await fs.readFile(storePath, 'utf8');
  const parsed = JSON.parse(raw || '{}');
  return {
    ...defaultStore,
    ...parsed,
  };
}

async function writeStore(store) {
  await ensureStore();
  await fs.writeFile(storePath, JSON.stringify(store, null, 2), 'utf8');
}

function matchesFilter(item, filter = {}) {
  return Object.entries(filter).every(([key, value]) => {
    if (key === '$or' && Array.isArray(value)) {
      return value.some((condition) => matchesFilter(item, condition));
    }

    const itemValue = item?.[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      if ('$regex' in value) {
        const regex = new RegExp(value.$regex, value.$options || '');
        return regex.test(String(itemValue || ''));
      }

      if ('$gte' in value) {
        const left = itemValue ? new Date(itemValue).getTime() : Number.NaN;
        const right = new Date(value.$gte).getTime();
        return !Number.isNaN(left) && left >= right;
      }
    }

    return itemValue === value;
  });
}

function sortItems(items, sort = {}) {
  const entries = Object.entries(sort);
  if (!entries.length) {
    return [...items];
  }

  return [...items].sort((left, right) => {
    for (const [key, direction] of entries) {
      const leftValue = left?.[key];
      const rightValue = right?.[key];

      if (leftValue === rightValue) {
        continue;
      }

      if (leftValue == null) {
        return 1;
      }

      if (rightValue == null) {
        return -1;
      }

      if (leftValue > rightValue) {
        return direction >= 0 ? 1 : -1;
      }

      if (leftValue < rightValue) {
        return direction >= 0 ? -1 : 1;
      }
    }

    return 0;
  });
}

function stampNew(document) {
  const now = new Date().toISOString();
  return {
    _id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
    ...document,
  };
}

function stampUpdate(existing, updates) {
  return {
    ...existing,
    ...updates,
    _id: existing._id,
    createdAt: existing.createdAt,
    updatedAt: new Date().toISOString(),
  };
}

export async function find(collection, filter = {}, options = {}) {
  const store = await readStore();
  let items = store[collection].filter((item) => matchesFilter(item, filter));
  items = sortItems(items, options.sort || {});

  if (typeof options.limit === 'number') {
    items = items.slice(0, options.limit);
  }

  return items;
}

export async function findOne(collection, filter = {}, options = {}) {
  const items = await find(collection, filter, { ...options, limit: 1 });
  return items[0] || null;
}

export async function findById(collection, id) {
  if (!id) {
    return null;
  }

  return findOne(collection, { _id: id });
}

export async function insert(collection, document) {
  const store = await readStore();
  const created = stampNew(document);
  store[collection].push(created);
  await writeStore(store);
  return created;
}

export async function upsert(collection, filter, updates) {
  const store = await readStore();
  const index = store[collection].findIndex((item) => matchesFilter(item, filter));

  if (index >= 0) {
    const updated = stampUpdate(store[collection][index], updates);
    store[collection][index] = updated;
    await writeStore(store);
    return updated;
  }

  const created = stampNew({
    ...filter,
    ...updates,
  });
  store[collection].push(created);
  await writeStore(store);
  return created;
}

export async function updateById(collection, id, updates) {
  const store = await readStore();
  const index = store[collection].findIndex((item) => item._id === id);

  if (index < 0) {
    return null;
  }

  const nextValue =
    typeof updates === 'function' ? updates(store[collection][index]) : stampUpdate(store[collection][index], updates);

  store[collection][index] = nextValue;
  await writeStore(store);
  return nextValue;
}

export async function count(collection, filter = {}) {
  const items = await find(collection, filter);
  return items.length;
}
