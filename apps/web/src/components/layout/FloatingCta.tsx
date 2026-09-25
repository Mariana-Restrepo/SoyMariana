import { useInquiry } from '@/app/inquiry';
import { Button } from '@/components/ui/Button';
import { useElementVisible } from '@/hooks/use-scroll-state';
import { cn } from '@/lib/utils';

/**
 * Pastilla flotante "¿Creamos algo?" solo en móvil: aparece cuando el hero ya pasó
 * y se esconde mientras se ve la sección de marcas (donde el botón ya está a la vista).
 * Así una marca siempre tiene el contacto a un toque.
 */
export function FloatingCta() {
  const heroVisible = useElementVisible('inicio');
  const workVisible = useElementVisible('trabajemos', 0.2);
  const { open } = useInquiry();
  const show = !heroVisible && !workVisible;

  return (
    <div
      id="floating-cta"
      className={cn(
        'fixed bottom-[calc(16px+env(safe-area-inset-bottom))] left-1/2 z-30 -translate-x-1/2 transition duration-300 ease-out-soft lg:hidden',
        show ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-5 opacity-0',
      )}
    >
      <Button
        variant="cereza"
        className="shadow-glow"
        tabIndex={show ? 0 : -1}
        onClick={() => open('floating')}
      >
        ¿Creamos algo? ♡
      </Button>
    </div>
  );
}
