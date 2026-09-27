import { z } from 'zod';

/**
 * Esquemas del contenido. Los tipos de la app salen de aquí (z.infer), así hay una sola fuente.
 * Los valores pueden ser [PLACEHOLDERS]: por eso los links no se validan como URL.
 */

export const categoryKeys = [
  'belleza',
  'cabello',
  'cuidado-personal',
  'restaurantes',
  'lugares',
  'productos',
  'lifestyle',
] as const;
export const categoryKeySchema = z.enum(categoryKeys);

export const verdictKeys = [
  'repite',
  'sorprendio',
  'vale-la-pena',
  'se-queda',
  'volveria',
  'no-convencio',
] as const;
export const verdictSchema = z.enum(verdictKeys);

/**
 * Transparencia: cómo llegó a Mariana cada cosa que recomienda.
 * propio = lo pagó ella · regalo = se lo enviaron sin costo · invitacion = la invitaron
 * · colaboracion = hay un acuerdo con la marca (pago u otra compensación).
 */
export const disclosureKeys = ['propio', 'regalo', 'invitacion', 'colaboracion'] as const;
export const disclosureKeySchema = z.enum(disclosureKeys);

export const toneSchema = z.enum(['rosa', 'cereza', 'azul', 'crema']);

/** Imagen con placeholder: si `src` está vacío se dibuja un bloque de color con la etiqueta. */
export const imageSchema = z.object({
  src: z.string().optional(),
  /** Versiones en varios anchos, ej. "/media/a-480.webp 480w, /media/a-960.webp 960w". */
  srcSet: z.string().optional(),
  alt: z.string().min(1),
  placeholder: z.string().min(1),
  tone: toneSchema.default('rosa'),
  width: z.number().int().positive().optional(),
  height: z.number().int().positive().optional(),
});

export const siteSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  locale: z.string().default('es-CO'),
  themeColor: z.string(),
  ogImage: z.string(),
  keywords: z.array(z.string()).default([]),
});

export const storyCardSchema = z.object({
  label: z.string(),
  text: z.string(),
  image: imageSchema,
});

export const profileSchema = z.object({
  name: z.string(),
  fullName: z.string(),
  age: z.number().int().optional(),
  city: z.string(),
  role: z.string(),
  eyebrow: z.string(),
  heroTitle: z.string(),
  heroEmphasis: z.string(),
  heroSubtitle: z.string(),
  heroWords: z.array(z.string()).min(1),
  heroImage: imageSchema,
  aboutTitle: z.string(),
  aboutEmphasis: z.string(),
  aboutSuffix: z.string(),
  story: z.array(storyCardSchema),
  closing: z.string(),
});

export const linksSchema = z.object({
  tiktok: z.object({ handle: z.string(), url: z.string() }),
  email: z.string(),
});

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  caption: z.string(),
  /** URL del mp4 (H.264, vertical 9:16, ≤ 3 MB). Vacío = placeholder. */
  src: z.string().optional(),
  poster: imageSchema,
  tiktokUrl: z.string(),
  category: categoryKeySchema.optional(),
  /** Si el video es regalo, invitación o colaboración. Opcional: sin etiqueta no se muestra nada. */
  disclosure: disclosureKeySchema.optional(),
});

export const categoryInfoSchema = z.object({
  key: categoryKeySchema,
  emoji: z.string(),
  name: z.string(),
  tone: toneSchema,
  blurb: z.string(),
  examples: z.array(z.string()),
});

export const recommendationSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: categoryKeySchema,
  verdict: verdictSchema,
  opinion: z.string(),
  liked: z.array(z.string()).default([]),
  disliked: z.array(z.string()).default([]),
  image: imageSchema,
  link: z.string().optional(),
  linkLabel: z.string().optional(),
  /** Cómo llegó a Mariana. `check:content:strict` exige elegirlo antes de publicar. */
  disclosure: disclosureKeySchema.optional(),
  /** El `link` es de afiliado (Mariana puede recibir una comisión). */
  affiliate: z.boolean().optional(),
  /** Enlace al video de TikTok donde Mariana habla de esto. */
  videoUrl: z.string().optional(),
});

export const placeSchema = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  city: z.string(),
  category: categoryKeySchema,
  verdict: verdictSchema,
  tried: z.array(z.string()),
  liked: z.array(z.string()).default([]),
  review: z.string(),
  image: imageSchema,
  mapUrl: z.string().optional(),
  socialUrl: z.string().optional(),
  /** Cómo llegó a Mariana (propio, invitación, colaboración…). Obligatorio para publicar. */
  disclosure: disclosureKeySchema.optional(),
  /** Enlace al video de TikTok donde Mariana habla de este lugar. */
  videoUrl: z.string().optional(),
});

export const metricFormatSchema = z.enum(['int', 'compact', 'approx']);
export const metricSchema = z.object({
  id: z.string(),
  label: z.string(),
  value: z.number(),
  format: metricFormatSchema,
  tone: toneSchema,
});
export const audienceGroupSchema = z.object({
  id: z.string(),
  title: z.string(),
  /** De quién son los datos (seguidores, espectadores…) y el periodo, si aplica. */
  caption: z.string(),
  /** Porcentajes (0–100). Cada grupo debe sumar 100. */
  items: z.array(z.object({ label: z.string(), value: z.number().min(0).max(100) })).min(1),
});
export const audienceSchema = z.object({
  title: z.string(),
  groups: z.array(audienceGroupSchema).min(1),
});
export const metricsFileSchema = z.object({
  /** Fecha de la última actualización (ISO o texto). Se muestra como "Actualizado: …". */
  updatedAt: z.string(),
  /** Nota opcional bajo las cifras (solo si es cierta). */
  note: z.string().optional(),
  metrics: z.array(metricSchema),
  /** Quién ve y sigue a Mariana (TikTok Studio). Se muestra solo si existe. */
  audience: audienceSchema.optional(),
  /** Métricas futuras: estructura lista, NO se muestran hasta tener datos reales. */
  pending: z.array(z.string()).default([]),
});

export const collabSchema = z.object({
  eyebrow: z.string(),
  title: z.string(),
  titleEmphasis: z.string(),
  phrase: z.string(),
  audiencesTitle: z.string(),
  audiences: z.array(z.string()),
  formatsTitle: z.string(),
  formats: z.array(z.object({ id: z.string(), title: z.string() })),
  /** Opciones del select del formulario. */
  types: z.array(z.string()),
});

export const brandInquirySchema = z.object({
  name: z.string().trim().min(1),
  brand: z.string().trim().min(1),
  email: z.string().trim().email(),
  brandSocial: z.string().trim().optional(),
  collabType: z.string().trim().min(1),
  message: z.string().trim().min(1),
  budget: z.string().trim().optional(),
});

/** Definiciones de las etiquetas de transparencia (se muestran en la web, la app y los términos). */
export const disclosureInfoSchema = z.object({
  key: disclosureKeySchema,
  label: z.string().min(1),
  description: z.string().min(1),
});
export const disclosuresFileSchema = z.object({
  title: z.string(),
  intro: z.string(),
  items: z.array(disclosureInfoSchema).min(1),
  affiliate: z.object({ label: z.string(), description: z.string() }),
});

/**
 * Documentos legales. Los textos aceptan {{name}}, {{place}} y {{email}}: se rellenan con los
 * datos de la responsable (controller) y de links.json al mostrarlos.
 */
export const legalSectionSchema = z.object({
  id: z.string(),
  title: z.string(),
  paragraphs: z.array(z.string()).default([]),
  list: z.array(z.string()).optional(),
  /** Párrafo que va después de la lista. */
  closing: z.string().optional(),
  /** Si es true, se muestran aquí las etiquetas de transparencia (disclosures.json). */
  showDisclosures: z.boolean().optional(),
});
export const legalDocSchema = z.object({
  title: z.string(),
  description: z.string(),
  intro: z.string(),
  sections: z.array(legalSectionSchema).min(1),
});
export const legalFileSchema = z.object({
  /** Fecha de la última actualización de los textos. */
  updatedAt: z.string(),
  /** Pon true cuando una persona abogada haya revisado estos textos. `--strict` falla si es false. */
  reviewedByLawyer: z.boolean(),
  controller: z.object({
    name: z.string(),
    place: z.string(),
    /** Teléfono de contacto (la norma de datos personales lo pide entre los datos de la responsable). */
    phone: z.string().optional(),
  }),
  privacy: legalDocSchema,
  terms: legalDocSchema,
});
