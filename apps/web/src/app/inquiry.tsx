import { track } from '@soymariana/core';
import {
  createContext,
  lazy,
  Suspense,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

/** El formulario pesa poco pero no se necesita al cargar: se descarga la primera vez que se abre. */
const InquiryDialog = lazy(() => import('@/sections/work/InquiryDialog'));

type InquiryApi = { open: (source: string) => void };
const InquiryContext = createContext<InquiryApi>({ open: () => {} });

export const useInquiry = () => useContext(InquiryContext);

export function InquiryProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [session, setSession] = useState(0); // 0 = nunca abierto; cada apertura reinicia el formulario

  const open = useCallback((source: string) => {
    track('cta_click', { source });
    setSession((s) => s + 1);
    setIsOpen(true);
  }, []);

  const api = useMemo(() => ({ open }), [open]);

  return (
    <InquiryContext.Provider value={api}>
      {children}
      {session > 0 && (
        <Suspense fallback={null}>
          <InquiryDialog key={session} open={isOpen} onClose={() => setIsOpen(false)} />
        </Suspense>
      )}
    </InquiryContext.Provider>
  );
}
