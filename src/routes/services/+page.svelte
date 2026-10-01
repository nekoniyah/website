<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {services} from '$lib/data';
    import {t} from '$lib/i18n.svelte';
    import ServiceCard from '$lib/components/ServiceCard.svelte';
</script>

<Seo title={t('services.title')} description={t('seo.services')}/>

<div class="container">
    <h1>{t('services.title')}</h1>
    <p class="muted">{t('services.subtitle')}</p>
    <div class="grid">
        {#each services as service (service.slug)}
            <ServiceCard {service}/>
        {/each}
    </div>
</div>
