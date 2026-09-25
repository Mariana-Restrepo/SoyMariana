/** Hash estable de un texto (FNV-1a, 32 bits). */
export function hashString(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Rotación "orgánica" en grados para una tarjeta. Sale del id, así el mismo elemento
 * siempre se inclina igual (no cambia en cada carga ni entre web y móvil).
 */
export function seededRotation(id: string, maxDeg = 1.8): number {
  const unit = (hashString(id) % 2001) / 1000 - 1; // -1 … 1
  return Math.round(unit * maxDeg * 10) / 10;
}
