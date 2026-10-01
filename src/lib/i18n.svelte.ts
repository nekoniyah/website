import en from '$lib/i18n/en.json';
import fr from '$lib/i18n/fr.json';
import {settings} from '$lib/data';

export type Locale = 'en' | 'fr';
export type Localized = string | { en: string; fr: string };
export type LocalizedList = string[] | { en: string[]; fr: string[] };

export const locales: Locale[] = ['en', 'fr'];
const dictionaries: Record<Locale, Record<string, string>> = {en, fr};
const STORAGE_KEY = 'locale';

let locale = $state<Locale>('en');

function apply(next: Locale) {
    locale = next;
    document.documentElement.lang = next;
}

export const i18n = {
    get locale() {
        return locale;
    },
    /** Restore the saved locale, falling back to the browser language. Client only. */
    init() {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved === 'en' || saved === 'fr') return apply(saved);
        apply(navigator.language.toLowerCase().startsWith('fr') ? 'fr' : 'en');
    },
    set(next: Locale) {
        localStorage.setItem(STORAGE_KEY, next);
        apply(next);
    }
};

/** Translate a UI string, with optional {placeholder} params. */
export function t(key: string, params: Record<string, string | number> = {}): string {
    params = {brand: settings.brand, ...params};
    const text = dictionaries[locale][key] ?? dictionaries.en[key] ?? key;
    return text.replace(/\{(\w+)\}/g, (_, k) => String(params[k] ?? `{${k}}`));
}

/** Pick the current language from a data value. */
export function tr<T extends string | string[]>(value: T | { en: T; fr: T }): T {
    if (typeof value === 'string' || Array.isArray(value)) return value as T;
    return value[locale] ?? value.en;
}

export function money(amount: number): string {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: settings.currency,
        maximumFractionDigits: 0
    }).format(amount);
}

export function pageTitle(title: string): string {
    return `${title} — ${settings.brand}`;
}
