import type { BrandInquiry } from '@soymariana/content';

/** Campos del formulario tal como los escribe la persona (todo texto). */
export type InquiryDraft = {
  name: string;
  brand: string;
  email: string;
  brandSocial: string;
  collabType: string;
  message: string;
  budget: string;
};

export type InquiryStep = 1 | 2;
export type InquiryErrors = Partial<Record<keyof InquiryDraft, string>>;

export const emptyInquiry: InquiryDraft = {
  name: '',
  brand: '',
  email: '',
  brandSocial: '',
  collabType: '',
  message: '',
  budget: '',
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Mensajes en la voz de Mariana: amables, no de formulario corporativo. */
export const inquiryMessages = {
  name: 'Dime cómo te llamas.',
  brand: '¿De qué marca me escribes?',
  email: 'Revisa el correo, algo no cuadra.',
  message: 'Cuéntame un poquito la idea.',
} as const;

export function validateInquiry(
  draft: InquiryDraft,
  step: InquiryStep | 'all' = 'all',
): InquiryErrors {
  const errors: InquiryErrors = {};
  if (step === 1 || step === 'all') {
    if (!draft.name.trim()) errors.name = inquiryMessages.name;
    if (!draft.brand.trim()) errors.brand = inquiryMessages.brand;
    if (!EMAIL.test(draft.email.trim())) errors.email = inquiryMessages.email;
  }
  if (step === 2 || step === 'all') {
    if (!draft.message.trim()) errors.message = inquiryMessages.message;
  }
  return errors;
}

export function toInquiry(draft: InquiryDraft, defaultType: string): BrandInquiry {
  const optional = (v: string) => (v.trim() ? v.trim() : undefined);
  return {
    name: draft.name.trim(),
    brand: draft.brand.trim(),
    email: draft.email.trim(),
    brandSocial: optional(draft.brandSocial),
    collabType: draft.collabType.trim() || defaultType,
    message: draft.message.trim(),
    budget: optional(draft.budget),
  };
}

export function buildMailto(to: string, inquiry: BrandInquiry): string {
  const subject = `Colaboración con ${inquiry.brand}`;
  const body = [
    `Hola Mariana, soy ${inquiry.name} de ${inquiry.brand}.`,
    '',
    `Tipo de colaboración: ${inquiry.collabType}`,
    inquiry.brandSocial ? `Red de la marca: ${inquiry.brandSocial}` : '',
    inquiry.budget ? `Presupuesto aproximado: ${inquiry.budget}` : '',
    '',
    inquiry.message,
    '',
    `Mi correo: ${inquiry.email}`,
  ]
    .filter((line, i, all) => line !== '' || all[i - 1] !== '')
    .join('\n');
  return `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

export type SubmitOptions = {
  /** Servicio que recibe el JSON (Formspree, Web3Forms, función serverless…). */
  endpoint?: string;
  /** Correo de Mariana: se usa como respaldo (abre el correo de quien escribe). */
  email?: string;
  /** Solo desarrollo: simula un envío exitoso sin red ni correo. */
  simulate?: boolean;
  /** Campo trampa anti-spam: si trae texto, es un bot y se finge éxito sin enviar. */
  honeypot?: string;
  fetchImpl?: typeof fetch;
};

export type SubmitResult =
  | { ok: true; via: 'endpoint' | 'simulated' | 'ignored' }
  | { ok: true; via: 'mailto'; href: string }
  | { ok: false; error: string };

export async function submitInquiry(
  inquiry: BrandInquiry,
  options: SubmitOptions = {},
): Promise<SubmitResult> {
  if (options.honeypot?.trim()) return { ok: true, via: 'ignored' };

  if (options.simulate) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { ok: true, via: 'simulated' };
  }

  if (options.endpoint) {
    try {
      const doFetch = options.fetchImpl ?? fetch;
      const res = await doFetch(options.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(inquiry),
      });
      if (!res.ok) return { ok: false, error: `El servicio respondió ${res.status}.` };
      return { ok: true, via: 'endpoint' };
    } catch {
      return { ok: false, error: 'No pude conectar.' };
    }
  }

  if (options.email && !/^\[.*\]$/.test(options.email)) {
    return { ok: true, via: 'mailto', href: buildMailto(options.email, inquiry) };
  }
  return { ok: false, error: 'El formulario todavía no está conectado.' };
}
