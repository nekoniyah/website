import {error} from '@sveltejs/kit';
import {services} from '$lib/data';
import type {EntryGenerator, PageLoad} from './$types';

export const entries: EntryGenerator = () => services.map(({slug}) => ({slug}));

export const load: PageLoad = ({params}) => {
    const service = services.find((s) => s.slug === params.slug);
    if (!service) error(404, 'Not found');
    return {service};
};
