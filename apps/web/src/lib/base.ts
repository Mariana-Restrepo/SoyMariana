/**
 * Ruta base del sitio. En local es "/"; en GitHub Pages es "/SoyMariana/".
 * Las rutas del contenido (packages/content) se escriben desde la raíz ("/media/...")
 * y pasan por aquí para funcionar en cualquier subcarpeta.
 */
const BASE = import.meta.env.BASE_URL;

/** "/media/a.webp" → "/SoyMariana/media/a.webp". Deja intactas las URLs externas. */
export function withBase(path: string): string;
export function withBase(path: string | undefined): string | undefined;
export function withBase(path: string | undefined) {
  if (!path || !path.startsWith('/') || path.startsWith('//')) return path;
  return BASE + path.slice(1);
}

/** Igual que withBase, para cada URL de un srcSet ("/a.webp 480w, /b.webp 576w"). */
export function withBaseSrcSet(srcSet: string | undefined) {
  return srcSet?.replace(/(^|,\s*)\/(?!\/)/g, `$1${BASE}`);
}

/** Quita la ruta base del pathname para reconocer páginas como /privacidad. */
export function stripBase(pathname: string) {
  return BASE !== '/' && pathname.startsWith(BASE) ? '/' + pathname.slice(BASE.length) : pathname;
}
