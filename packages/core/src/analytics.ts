/**
 * Interfaz de analítica. Hoy no hace nada (no hay proveedor ni cookies).
 * Para conectar Plausible/Umami/GA basta llamar a `setTracker` una vez al iniciar la app.
 */
export type TrackProps = Record<string, string | number | boolean | undefined>;
export type Tracker = (event: string, props?: TrackProps) => void;

let tracker: Tracker = () => {};

export function setTracker(next: Tracker): void {
  tracker = next;
}

export function track(event: string, props?: TrackProps): void {
  try {
    tracker(event, props);
  } catch {
    /* la analítica nunca debe romper la app */
  }
}
