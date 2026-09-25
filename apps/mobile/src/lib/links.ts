import { isPlaceholder } from '@soymariana/content';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

/** Devuelve la URL solo si es real: un [PLACEHOLDER] nunca es un enlace. */
export function safeUrl(url: string | undefined): string | undefined {
  if (!url || isPlaceholder(url)) return undefined;
  return url;
}

export function safeMailto(email: string | undefined): string | undefined {
  if (!email || isPlaceholder(email)) return undefined;
  return `mailto:${email}`;
}

/** Abre enlaces web en el navegador de la app y correos/otros con el sistema. */
export async function openLink(url: string | undefined): Promise<void> {
  const target = safeUrl(url);
  if (!target) return;
  try {
    if (/^https?:\/\//i.test(target)) await WebBrowser.openBrowserAsync(target);
    else await Linking.openURL(target);
  } catch {
    // Sin app de correo o sin navegador: no rompe la pantalla.
  }
}
