import { ro, TranslationKeys } from './ro';
import { en } from './en';

// Language mapping with country codes
export const translations: Record<string, TranslationKeys> = {
  RO: ro, // Romania
  EN: en, // English (fallback)
  AT: en, // Austria
  BE: en, // Belgium
  BG: en, // Bulgaria
  CY: en, // Cyprus
  CZ: en, // Czech Republic
  DE: en, // Germany
  DK: en, // Denmark
  EE: en, // Estonia
  ES: en, // Spain
  FI: en, // Finland
  FR: en, // France
  GR: en, // Greece
  HR: en, // Croatia
  HU: en, // Hungary
  IE: en, // Ireland
  IT: en, // Italy
  LT: en, // Lithuania
  LU: en, // Luxembourg
  LV: en, // Latvia
  MT: en, // Malta
  NL: en, // Netherlands
  PL: en, // Poland
  PT: en, // Portugal
  SE: en, // Sweden
  SI: en, // Slovenia
  SK: en, // Slovakia
};

// Default language
export const DEFAULT_LANGUAGE = 'RO';

// Available languages
export const AVAILABLE_LANGUAGES = Object.keys(translations);

// Get translation for a specific language
export function getTranslation(languageCode: string): TranslationKeys {
  return translations[languageCode] || translations[DEFAULT_LANGUAGE];
}

export type { TranslationKeys };
export { ro, en };