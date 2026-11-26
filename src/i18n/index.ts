import { withBase } from "@/config";
import en from "@/i18n/en";
import es from "@/i18n/es";

import type { Translations } from "@/i18n/en";

export const LANGUAGES = { en, es } satisfies Record<string, Translations>;

export type Language = keyof typeof LANGUAGES;

/** Page path of each language (English lives at the root). */
export const LANGUAGE_PATHS: Record<Language, string> = { en: withBase("/"), es: withBase("/es/") };

export const getT = (language: Language): Translations => LANGUAGES[language];

export type { Translations };
