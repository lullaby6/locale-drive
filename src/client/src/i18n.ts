import { create } from "zustand";

import en from "@/languages/en";
import es from "@/languages/es";

import type { Translations } from "@/languages/en";

export const LANGUAGES = { en, es } satisfies Record<string, Translations>;

export type Language = keyof typeof LANGUAGES;

const STORAGE_KEY = "language";

function isLanguage(value: unknown): value is Language {
	return typeof value === "string" && value in LANGUAGES;
}

/** Saved choice first; otherwise Spanish for any "es-*" device language, English for everything else. */
function detectLanguage(): Language {
	const saved = localStorage.getItem(STORAGE_KEY);
	if (isLanguage(saved)) return saved;

	const deviceLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
	return deviceLanguages[0]?.toLowerCase().startsWith("es") ? "es" : "en";
}

interface I18nState {
	language: Language;
	t: Translations;
	setLanguage: (language: Language) => void;
}

const initialLanguage = detectLanguage();
document.documentElement.lang = initialLanguage;

export const useI18n = create<I18nState>(set => ({
	language: initialLanguage,
	t: LANGUAGES[initialLanguage],
	setLanguage: language => {
		localStorage.setItem(STORAGE_KEY, language);
		document.documentElement.lang = language;
		set({ language, t: LANGUAGES[language] });
	},
}));

/** Translations for React components (re-render when the language changes). */
export const useT = () => useI18n(state => state.t);

/** Translations outside React (store actions, toasts). */
export const getT = () => useI18n.getState().t;

export const getLanguage = () => useI18n.getState().language;
