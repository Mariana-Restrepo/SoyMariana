import categoriesJson from '../data/categories.json';
import collabJson from '../data/collab.json';
import developerJson from '../data/developer.json';
import linksJson from '../data/links.json';
import metricsJson from '../data/metrics.json';
import placesJson from '../data/places.json';
import profileJson from '../data/profile.json';
import recommendationsJson from '../data/recommendations.json';
import siteJson from '../data/site.json';
import videosJson from '../data/videos.json';
import type {
  CategoryInfo,
  Collab,
  Developer,
  Links,
  MetricsFile,
  Place,
  Profile,
  Recommendation,
  Site,
  Video,
} from './types';

/**
 * Contenido de Soy Mariana. Para cambiar textos, videos, recomendaciones o proyectos
 * se editan los JSON de /data; los componentes no se tocan.
 *
 * Los JSON se validan con `npm run check:content` (esquemas zod), no en el navegador,
 * para no cargar zod en el bundle.
 */
export const site = siteJson as unknown as Site;
export const profile = profileJson as unknown as Profile;
export const links = linksJson as unknown as Links;
export const videos = videosJson as unknown as Video[];
export const categories = categoriesJson as unknown as CategoryInfo[];
export const recommendations = recommendationsJson as unknown as Recommendation[];
export const places = placesJson as unknown as Place[];
export const metrics = metricsJson as unknown as MetricsFile;
export const collab = collabJson as unknown as Collab;
export const developer = developerJson as unknown as Developer;

export const content = {
  site,
  profile,
  links,
  videos,
  categories,
  recommendations,
  places,
  metrics,
  collab,
  developer,
};

export { extractPlaceholders, findPlaceholders, isPlaceholder } from './placeholders';
export type * from './types';
