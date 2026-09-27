import { AnimatePresence, m } from 'motion/react';
import { useEffect, useRef, useState } from 'react';

import { useInquiry } from '@/app/inquiry';
import { Button } from '@/components/ui/Button';
import { useActiveSection, useScrolled } from '@/hooks/use-scroll-state';
import { useIsDesktop } from '@/hooks/use-media-query';
import { ease, seconds } from '@/lib/motion';
import { cn } from '@/lib/utils';

const NAV = [
  { id: 'videos', label: 'Videos' },
  { id: 'coleccion', label: 'Lo que pruebo' },
  { id: 'sobre-mi', label: 'Sobre mí' },
] as const;

/** Qué ítem del menú se ilumina según la sección que se ve. */
const SECTION_TO_NAV: Record<string, string> = {
  videos: 'videos',
  coleccion: 'coleccion',
  'sobre-mi': 'sobre-mi',
  numeros: 'sobre-mi',
};

/** Contenido de la página que se "apaga" (inert) mientras el menú móvil está abierto. */
const INERT_TARGETS = ['main', 'site-footer', 'floating-cta'];

export function Header() {
  const scrolled = useScrolled(40);
  const isDesktop = useIsDesktop();
  const { open: openInquiry } = useInquiry();
  const activeSection = useActiveSection(Object.keys(SECTION_TO_NAV));
  const activeNav = activeSection ? SECTION_TO_NAV[activeSection] : null;

  const [menuOpen, setMenuOpen] = useState(false);
  const burgerRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const menuWasOpen = useRef(false);

  // Si se agranda la ventana, el menú móvil deja de tener sentido.
  const sheetOpen = menuOpen && !isDesktop;

  useEffect(() => {
    if (!sheetOpen) return;
    const targets = INERT_TARGETS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => !!el,
    );
    targets.forEach((el) => el.setAttribute('inert', ''));
    const previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    firstLinkRef.current?.focus();
    menuWasOpen.current = true;
    const burger = burgerRef.current;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setMenuOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      targets.forEach((el) => el.removeAttribute('inert'));
      document.documentElement.style.overflow = previousOverflow;
      window.removeEventListener('keydown', onKey);
      if (menuWasOpen.current) burger?.focus({ preventScroll: true });
    };
  }, [sheetOpen]);

  const linkClass = (id: string) =>
    cn(
      'relative py-2 no-underline after:absolute after:inset-x-0 after:bottom-0.5 after:h-0.5 after:origin-left after:rounded-full after:bg-rosa after:transition-transform after:duration-300 after:ease-out-soft hover:after:scale-x-100',
      activeNav === id ? 'after:scale-x-100' : 'after:scale-x-0',
    );

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-40 transition-[height,background-color,box-shadow,backdrop-filter] duration-300 ease-out-soft',
          scrolled ? 'h-[var(--header-h-compact)]' : 'h-[var(--header-h)]',
          scrolled &&
            !sheetOpen &&
            'bg-paper/85 shadow-[0_1px_0_rgb(43_31_38_/_0.07)] backdrop-blur-md',
        )}
      >
        <div className="wrap flex h-full items-center gap-7">
          <a
            href="#inicio"
            className={cn(
              'group flex items-baseline gap-1.5 font-serif no-underline transition-[font-size] duration-300 ease-out-soft',
              scrolled ? 'text-[1.4rem]' : 'text-[1.75rem]',
            )}
          >
            <em className="text-[0.95em]">Soy</em>
            <span>Mariana</span>
            <span
              aria-hidden="true"
              className="inline-block -translate-y-[0.25em] text-[0.6em] not-italic text-cereza transition-transform duration-300 ease-out-soft group-hover:-rotate-6 group-hover:scale-125"
            >
              ♡
            </span>
          </a>

          <nav
            aria-label="Principal"
            className="ml-auto hidden items-center gap-6 text-[0.95rem] font-normal lg:flex"
          >
            {NAV.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                aria-current={activeNav === item.id ? 'true' : undefined}
                className={linkClass(item.id)}
              >
                {item.label}
              </a>
            ))}
            <Button
              variant="cereza"
              className="min-h-10 px-5"
              onClick={() => openInquiry('header')}
            >
              ¿Creamos algo?
            </Button>
          </nav>

          <button
            ref={burgerRef}
            type="button"
            aria-expanded={sheetOpen}
            aria-controls="mobile-menu"
            aria-label={sheetOpen ? 'Cerrar menú' : 'Abrir menú'}
            onClick={() => setMenuOpen((v) => !v)}
            className="relative z-[45] ml-auto grid size-11 place-items-center rounded-full shadow-[inset_0_0_0_1.5px_rgb(43_31_38_/_0.25)] lg:hidden"
          >
            <span
              aria-hidden="true"
              className={cn(
                'relative block h-[1.5px] w-[18px] bg-ink transition-colors',
                sheetOpen && 'bg-transparent',
              )}
            >
              <span
                className={cn(
                  'absolute left-0 top-[-6px] h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ease-out-soft',
                  sheetOpen && 'translate-y-[6px] rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute left-0 top-[6px] h-[1.5px] w-[18px] bg-ink transition-transform duration-300 ease-out-soft',
                  sheetOpen && '-translate-y-[6px] -rotate-45',
                )}
              />
            </span>
          </button>
        </div>
      </header>

      <AnimatePresence>
        {sheetOpen && (
          <m.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menú"
            className="fixed inset-0 z-[35] flex flex-col gap-1.5 bg-rosa-tint px-[var(--gutter)] pb-8 pt-[calc(var(--header-h)+28px)]"
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: seconds.base, ease }}
          >
            {NAV.map((item, i) => (
              <a
                key={item.id}
                ref={i === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                onClick={() => setMenuOpen(false)}
                className="py-1.5 font-serif text-[2.6rem] leading-[1.15] no-underline"
              >
                {item.id === 'coleccion' ? (
                  <>
                    Lo que <em className="text-cereza-ink">pruebo</em>
                  </>
                ) : (
                  item.label
                )}
              </a>
            ))}
            <Button
              variant="cereza"
              className="mt-4 self-start"
              onClick={() => {
                setMenuOpen(false);
                openInquiry('menu');
              }}
            >
              ¿Creamos algo?
            </Button>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
}
