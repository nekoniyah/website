import showcaseData from '$lib/data/showcase.json';
import servicesData from '$lib/data/services.json';
import calculatorData from '$lib/data/calculator.json';
import settingsData from '$lib/data/settings.json';
import type {Localized, LocalizedList} from '$lib/i18n.svelte';

export type Category = 'website' | 'bot' | 'backend';

export interface ShowcaseItem {
    id: string;
    title: Localized;
    category: Category;
    description: Localized;
    image?: string;
    tags?: string[];
    url?: string;
}

export interface Service {
    slug: string;
    category: Category;
    name: Localized;
    tagline: Localized;
    description: Localized;
    /** Starting price, in the currency from settings.json */
    price: number;
    /** Base hours, used by the calculator */
    hours: number;
    delivery: Localized;
    features: LocalizedList;
}

export interface CalcFeature {
    id: string;
    label: Localized;
    price: number;
    hours: number;
    categories: Category[];
    tier?: string;
    description?: Localized;
    /** Ids of features that are automatically added with this one */
    requires?: string[];
    /** Customers can order up to this many of the feature (default 1: tick box only) */
    maxQuantity?: number;
}

export interface Settings {
    currency: string;
    contactEmail: string;
    hoursPerDay: number;
    /** Minimum order total, in the settings currency */
    minimumPrice: number;
    brand: string;
    /** Public origin of the site, no trailing path (used for canonical URLs and the sitemap) */
    siteUrl: string;
    /** Default social preview image (path or URL); leave empty for none */
    ogImage: string;
    company: {
        legalName: string;
        legalForm?: Localized;
        siret: string;
        address: string[];
        vat?: Localized;
    };
}

export const showcase = showcaseData as ShowcaseItem[];
export const services = servicesData as Service[];
export const calcFeatures = (calculatorData as { features: CalcFeature[] }).features;
export const settings = settingsData as Settings;

export const categories: Category[] = ['website', 'bot', 'backend'];

/** Price shown for a service before any option is added. */
export const startingPrice = (service: Service) => Math.max(service.price, settings.minimumPrice);

/** Feature id -> quantity ordered. */
export type Selection = Record<string, number>;

export interface EstimateLine {
    feature: CalcFeature;
    quantity: number;
}

/** Selected features plus everything they require, limited to the service's category. */
export function resolveFeatures(service: Service, selection: Selection): EstimateLine[] {
    const available = calcFeatures.filter((f) => f.categories.includes(service.category));
    const wanted = new Map<string, number>();
    for (const f of available) {
        const q = Math.floor(selection[f.id] ?? 0);
        if (q > 0) wanted.set(f.id, Math.min(q, f.maxQuantity ?? 1));
    }
    for (let changed = true; changed;) {
        changed = false;
        for (const f of available) {
            if (!wanted.has(f.id)) continue;
            for (const r of f.requires ?? []) {
                if (!wanted.has(r)) wanted.set(r, 1), (changed = true);
            }
        }
    }
    return available.filter((f) => wanted.has(f.id)).map((feature) => ({feature, quantity: wanted.get(feature.id)!}));
}

export function estimate(service: Service, selection: Selection) {
    const lines = resolveFeatures(service, selection);
    const sum = service.price + lines.reduce((s, l) => s + l.feature.price * l.quantity, 0);
    const total = Math.max(sum, settings.minimumPrice);
    const hours = service.hours + lines.reduce((s, l) => s + l.feature.hours * l.quantity, 0);
    return {lines, total, hours, minimumApplied: total > sum};
}

/** "id:qty,id" <-> Selection, used in the calculator -> contact link. */
export const encodeSelection = (lines: EstimateLine[]) =>
    lines.map((l) => (l.quantity > 1 ? `${l.feature.id}:${l.quantity}` : l.feature.id)).join(",");

export function decodeSelection(value: string | null): Selection {
    const selection: Selection = {};
    for (const part of value?.split(",") ?? []) {
        const [id, q] = part.split(":");
        if (id) selection[id] = Number(q) > 0 ? Number(q) : 1;
    }
    return selection;
}
