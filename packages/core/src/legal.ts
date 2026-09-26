/** Rutas de las páginas legales del sitio web. */
export const legalSlugs = ['privacidad', 'terminos'] as const;
export type LegalSlug = (typeof legalSlugs)[number];

/**
 * "/privacidad", "/privacidad/" o "/Privacidad" → 'privacidad'. Cualquier otra ruta → null
 * (es la página principal). Solo mira la ruta: sin dominio, sin # ni ?.
 */
export function legalSlugFromPath(pathname: string): LegalSlug | null {
  const clean = pathname.replace(/\/+$/, '').replace(/^\//, '').toLowerCase();
  return (legalSlugs as readonly string[]).includes(clean) ? (clean as LegalSlug) : null;
}

/** Rellena {{name}}, {{place}} y {{email}} en los textos legales. Lo desconocido se deja tal cual. */
export function fillLegalText(text: string, values: Record<string, string>): string {
  return text.replace(/\{\{\s*(\w+)\s*\}\}/g, (token, key: string) => values[key] ?? token);
}
