import { useEffect, useState } from 'react';

export function useAsyncData(loader, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function run() {
      setLoading(true);
      setError('');

      try {
        const result = await loader();
        if (active) {
          setData(result);
        }
      } catch (caughtError) {
        if (active) {
          setError(caughtError.response?.data?.message || caughtError.message || 'Request failed');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    run();

    return () => {
      active = false;
    };
  }, dependencies);

  return { data, loading, error, setData };
}
