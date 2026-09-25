import type { z } from 'zod';

import type * as S from './schemas';

/** Tipos derivados de los esquemas (una sola fuente de verdad). */
export type CategoryKey = z.infer<typeof S.categoryKeySchema>;
export type Verdict = z.infer<typeof S.verdictSchema>;
export type ToneName = z.infer<typeof S.toneSchema>;
export type ImageRef = z.infer<typeof S.imageSchema>;
export type Site = z.infer<typeof S.siteSchema>;
export type Profile = z.infer<typeof S.profileSchema>;
export type StoryCard = z.infer<typeof S.storyCardSchema>;
export type Links = z.infer<typeof S.linksSchema>;
export type Video = z.infer<typeof S.videoSchema>;
export type CategoryInfo = z.infer<typeof S.categoryInfoSchema>;
export type Recommendation = z.infer<typeof S.recommendationSchema>;
export type Place = z.infer<typeof S.placeSchema>;
export type Metric = z.infer<typeof S.metricSchema>;
export type MetricFormat = z.infer<typeof S.metricFormatSchema>;
export type MetricsFile = z.infer<typeof S.metricsFileSchema>;
export type Collab = z.infer<typeof S.collabSchema>;
export type DevProject = z.infer<typeof S.projectSchema>;
export type Developer = z.infer<typeof S.developerSchema>;
export type BrandInquiry = z.infer<typeof S.brandInquirySchema>;
