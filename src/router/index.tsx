import React, { createContext, useContext, useState, useEffect } from 'react';

interface RouterContextType {
  path: string;
  navigate: (href: string) => void;
  params: Record<string, string>;
  searchParams: URLSearchParams;
}

const RouterContext = createContext<RouterContextType>({
  path: '/',
  navigate: () => {},
  params: {},
  searchParams: new URLSearchParams(),
});

export const useRouter = () => useContext(RouterContext);

export function Link({
  href,
  children,
  className = '',
  activeClassName = '',
  onClick,
  ...props
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  onClick?: (e: React.MouseEvent<HTMLAnchorElement>) => void;
  [key: string]: any;
}) {
  const { path, navigate } = useRouter();
  const isActive = path === href || (href !== '/' && path.startsWith(href));

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (onClick) onClick(e);
    if (!e.defaultPrevented && !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey) {
      e.preventDefault();
      navigate(href);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive && activeClassName ? activeClassName : ''}`.trim()}
      {...props}
    >
      {children}
    </a>
  );
}

export function normalizePath(rawPath: string): string {
  if (!rawPath) return '/';
  const clean = rawPath.split('?')[0].split('#')[0];
  const trimmed = clean.replace(/\/+$/, '');
  return trimmed || '/';
}

export function RouterProvider({ children }: { children: React.ReactNode }) {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return normalizePath(window.location.pathname);
    }
    return '/';
  });

  const [searchParams, setSearchParams] = useState<URLSearchParams>(() => {
    if (typeof window !== 'undefined') {
      return new URLSearchParams(window.location.search);
    }
    return new URLSearchParams();
  });

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(normalizePath(window.location.pathname));
      setSearchParams(new URLSearchParams(window.location.search));
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (href: string) => {
    if (typeof window !== 'undefined') {
      const [pathname, search] = href.split('?');
      window.history.pushState({}, '', href);
      setCurrentPath(normalizePath(pathname));
      setSearchParams(new URLSearchParams(search ? `?${search}` : ''));
      window.scrollTo(0, 0);
    }
  };

  return (
    <RouterContext.Provider value={{ path: currentPath, navigate, params: {}, searchParams }}>
      {children}
    </RouterContext.Provider>
  );
}

// Route matching utility
export function matchRoute(pattern: string, pathname: string): { match: boolean; params: Record<string, string> } {
  const cleanPath = normalizePath(pathname);
  const patternSegments = pattern.split('/').filter(Boolean);
  const pathSegments = cleanPath.split('/').filter(Boolean);

  if (patternSegments.length !== pathSegments.length) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};

  for (let i = 0; i < patternSegments.length; i++) {
    const p = patternSegments[i];
    const s = pathSegments[i];

    if (p.startsWith(':')) {
      const paramName = p.slice(1);
      params[paramName] = decodeURIComponent(s);
    } else if (p.toLowerCase() !== s.toLowerCase()) {
      return { match: false, params: {} };
    }
  }

  return { match: true, params };
}
