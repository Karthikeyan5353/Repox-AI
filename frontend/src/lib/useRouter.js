import { useEffect, useState } from 'react';

function normalizePath(pathname) {
  if (!pathname || pathname === '/') {
    return '/';
  }

  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}

export function useRouter() {
  const [pathname, setPathname] = useState(() => normalizePath(window.location.pathname));

  useEffect(() => {
    const handleLocationChange = () => {
      setPathname(normalizePath(window.location.pathname));
    };

    window.addEventListener('popstate', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  const navigate = (nextPath) => {
    const normalized = normalizePath(nextPath);

    if (normalized === pathname) {
      return;
    }

    window.history.pushState({}, '', normalized);
    setPathname(normalized);
  };

  return { pathname, navigate };
}
