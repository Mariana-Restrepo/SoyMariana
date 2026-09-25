import { useSyncExternalStore } from 'react';

/** Suscripción a una media query (sin parpadeo de hidratación: la app no usa SSR). */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = window.matchMedia(query);
      mql.addEventListener('change', onChange);
      return () => mql.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => false,
  );
}

/** true en dispositivos con mouse (hover real); false en táctiles. */
export const useCanHover = () => useMediaQuery('(hover: hover) and (pointer: fine)');
export const useIsDesktop = () => useMediaQuery('(min-width: 64rem)');
