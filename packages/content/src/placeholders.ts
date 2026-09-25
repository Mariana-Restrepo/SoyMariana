/**
 * Un placeholder es un texto entre corchetes en MAYÚSCULAS: [VIDEO_TIKTOK_01], [CORREO], [CIUDAD]…
 * También cuentan los textos alternativos que dicen "(pendiente)". Sirve para saber qué
 * contenido real falta antes de publicar (`npm run check:content -- --strict`).
 */
const BRACKETED = /\[[A-ZÁÉÍÓÚÑ0-9_]{2,}\]/g;
const PENDING = /\(pendiente[^)]*\)/gi;

export function extractPlaceholders(value: string): string[] {
  return [...(value.match(BRACKETED) ?? []), ...(value.match(PENDING) ?? [])];
}

export function isPlaceholder(value: string): boolean {
  return extractPlaceholders(value).length > 0;
}

/**
 * Recorre cualquier estructura JSON y devuelve { ruta, placeholder } por cada ocurrencia.
 * Una imagen que ya tiene `src` real deja de contar su etiqueta `placeholder`.
 */
export function findPlaceholders(
  node: unknown,
  path = '$',
): { path: string; placeholder: string }[] {
  if (typeof node === 'string') {
    return extractPlaceholders(node).map((placeholder) => ({ path, placeholder }));
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, i) => findPlaceholders(item, `${path}[${i}]`));
  }
  if (node && typeof node === 'object') {
    const record = node as Record<string, unknown>;
    const resolvedImage = typeof record.src === 'string' && record.src.trim() !== '';
    return Object.entries(record)
      .filter(([key]) => !(resolvedImage && key === 'placeholder'))
      .flatMap(([key, value]) => findPlaceholders(value, `${path}.${key}`));
  }
  return [];
}
