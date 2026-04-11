import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 180, useClones: false });

export function getCachedValue(key) {
  return cache.get(key);
}

export function setCachedValue(key, value, ttl = 180) {
  cache.set(key, value, ttl);
  return value;
}

export async function withCache(key, ttl, factory) {
  const cached = getCachedValue(key);
  if (cached) {
    return cached;
  }

  const value = await factory();
  return setCachedValue(key, value, ttl);
}
