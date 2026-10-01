<script lang="ts">
    import {page} from '$app/state';
    import {settings} from '$lib/data';
    import {i18n, pageTitle} from '$lib/i18n.svelte';

    interface Props {
        /** Page title; the home page omits it to use the brand alone. */
        title?: string;
        description: string;
        /** Defaults to the current path. */
        path?: string;
        /** Absolute or site-relative image path for social previews. */
        image?: string;
    }

    const {title, description, path, image}: Props = $props();

    const fullTitle = $derived(title ? pageTitle(title) : settings.brand);
    const url = $derived(new URL(path ?? page.url.pathname, settings.siteUrl).href);
    const imageUrl = $derived(
        image || settings.ogImage ? new URL(image || settings.ogImage, settings.siteUrl).href : ''
    );
    const locale = $derived(i18n.locale === 'fr' ? 'fr_FR' : 'en_US');
</script>

<svelte:head>
    <title>{fullTitle}</title>
    <meta name="description" content={description}/>
    <link rel="canonical" href={url}/>

    <meta property="og:type" content="website"/>
    <meta property="og:site_name" content={settings.brand}/>
    <meta property="og:title" content={fullTitle}/>
    <meta property="og:description" content={description}/>
    <meta property="og:url" content={url}/>
    <meta property="og:locale" content={locale}/>
    {#if imageUrl}<meta property="og:image" content={imageUrl}/>{/if}

    <meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'}/>
    <meta name="twitter:title" content={fullTitle}/>
    <meta name="twitter:description" content={description}/>
    {#if imageUrl}<meta name="twitter:image" content={imageUrl}/>{/if}
</svelte:head>
