import legalJson from '../data/legal.json';
import type { LegalFile } from './types';

/**
 * Textos legales (privacidad y términos). Van en su propio módulo para que solo se carguen
 * donde se muestran: `import { legal } from '@soymariana/content/legal'`.
 */
export const legal = legalJson as unknown as LegalFile;
