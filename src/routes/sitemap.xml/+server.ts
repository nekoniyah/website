import {services, settings} from '$lib/data';
import type {RequestHandler} from './$types';

export const prerender = true;

const staticPaths = ['/', '/services', '/showcase', '/calculator', '/contact'];

export const GET: RequestHandler = () => {
    const paths = [...staticPaths, ...services.map((s) => `/services/${s.slug}`)];
    const urls = paths
        .map((p) => `  <url><loc>${new URL(p, settings.siteUrl).href}</loc></url>`)
        .join('\n');

    return new Response(
        `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        {headers: {'Content-Type': 'application/xml'}}
    );
};
