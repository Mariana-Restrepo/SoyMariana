import { isPlaceholder } from '@soymariana/content';

type ClassValue = string | false | null | undefined;

/** Une clases de Tailwind ignorando valores vacíos. */
export const cn = (...classes: ClassValue[]): string => classes.filter(Boolean).join(' ');

/**
 * Devuelve la URL solo si es real. Los [PLACEHOLDERS] (y valores vacíos) no son links:
 * así nada apunta a "[LINK_TIKTOK]" mientras falta el contenido.
 */
export function safeHref(url: string | undefined): string | undefined {
  if (!url || isPlaceholder(url)) return undefined;
  return url;
}

export function safeMailto(email: string | undefined): string | undefined {
  if (!email || isPlaceholder(email)) return undefined;
  return `mailto:${email}`;
}

/** Enlaces externos abren en pestaña nueva; los internos (#) y mailto no. */
export function externalProps(href: string | undefined) {
  return href && /^https?:\/\//i.test(href)
    ? ({ target: '_blank', rel: 'noopener noreferrer' } as const)
    : {};
}

export const isDev = import.meta.env.DEV;
