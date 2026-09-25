import { useCallback, useEffect, useState } from 'react';

/**
 * Sincroniza un parámetro de la URL (?r=slug) con el estado, para que un detalle
 * (ej. una recomendación) tenga link propio y se pueda compartir. Usa replaceState:
 * abrir y cerrar detalles no llena el historial de pasos hacia atrás.
 */
export function useDeepLink(name: string) {
  const read = useCallback(() => new URLSearchParams(window.location.search).get(name), [name]);
  const [value, setValue] = useState<string | null>(read);

  useEffect(() => {
    const onPop = () => setValue(read());
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, [read]);

  const set = useCallback(
    (next: string | null) => {
      const url = new URL(window.location.href);
      if (next) url.searchParams.set(name, next);
      else url.searchParams.delete(name);
      window.history.replaceState(null, '', url);
      setValue(next);
    },
    [name],
  );

  return [value, set] as const;
}
