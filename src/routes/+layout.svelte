<script lang="ts">
    import favicon from '$lib/assets/favicon.svg';
    import Navbar from "$lib/components/Navbar.svelte";
    import '$lib/styles/global.scss';
    import {onMount} from 'svelte';
    import {settings} from '$lib/data';
    import {i18n, t, tr} from '$lib/i18n.svelte';

    let {children} = $props();
    const {company} = settings;

    // Structured data describing the business, injected on every page.
    const organization = {
        '@context': 'https://schema.org',
        '@type': 'ProfessionalService',
        name: settings.brand,
        legalName: company.legalName,
        url: settings.siteUrl,
        email: settings.contactEmail,
        taxID: company.siret,
        address: {'@type': 'PostalAddress', streetAddress: company.address.join(', ')},
        serviceType: ['Web development', 'Discord bot development', 'Backend development']
    };
    // Escape "<" so the JSON can never close the script tag early.
    const jsonLd = JSON.stringify(organization).replace(/</g, '\\u003c');

    onMount(() => i18n.init());
</script>

<svelte:head>
    <link rel="icon" href={favicon}/>
    <meta name="theme-color" content="#fbfaf8"/>
    <link rel="sitemap" type="application/xml" href="/sitemap.xml"/>
    {@html `<script type="application/ld+json">${jsonLd}</script>`}
</svelte:head>

<Navbar/>

<main>
    {@render children()}
</main>

<footer>
    <div class="info">
        <p><strong>{company.legalName}</strong></p>
        {#if company.legalForm}<p>{tr(company.legalForm)}</p>{/if}
        <p>{company.address.join(', ')}</p>
        <p>{t('footer.siret', {siret: company.siret})}</p>
        {#if company.vat}<p>{tr(company.vat)}</p>{/if}
        <p><a href="mailto:{settings.contactEmail}">{settings.contactEmail}</a></p>
    </div>
    <p class="copy">{t('footer', {year: new Date().getFullYear()})}</p>
</footer>

<style lang="scss">
  main {
    min-height: 70vh;
  }

  footer {
    text-align: center;
    padding: 2rem 1rem 1.5rem;
    background: var(--blue);
    color: var(--muted);
    font-size: .9rem;

    p {
      margin: 0;
    }

    strong {
      color: var(--text);
    }
  }

  .info {
    margin-bottom: 1.25rem;
  }

  .copy {
    padding-top: 1rem;
    border-top: 1px solid var(--blue-strong);
    font-size: .8rem;
  }
</style>
