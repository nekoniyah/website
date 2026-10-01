<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {showcase, startingPrice} from '$lib/data';
    import {money, t, tr} from '$lib/i18n.svelte';
    import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';

    const {data} = $props();
    const service = $derived(data.service);
    const related = $derived(showcase.filter((s) => s.category === service.category).slice(0, 3));
</script>

<Seo title={tr(service.name)} description={tr(service.tagline) + ' ' + tr(service.description)}/>

<div class="container">
    <p><a href="/services">{t('services.all')}</a></p>
    <div class="layout">
        <div>
            <h1>{tr(service.name)}</h1>
            <p class="muted">{tr(service.tagline)}</p>
            <p>{tr(service.description)}</p>
            <h3>{t('services.included')}</h3>
            <ul>
                {#each tr(service.features) as f}
                    <li>{f}</li>
                {/each}
            </ul>
        </div>
        <aside class="card">
            <div class="aside-body">
                <p class="price"><small>{t('services.from')}</small> {money(startingPrice(service))}</p>
                <p class="muted">{t('services.delivery', {delivery: tr(service.delivery)})}</p>
                <div class="actions">
                    <a class="btn" href="/contact?service={service.slug}">{t('services.quote')}</a>
                    <a class="btn alt" href="/calculator?service={service.slug}">{t('services.estimate')}</a>
                </div>
            </div>
        </aside>
    </div>

    {#if related.length}
        <h2>{t('services.related')}</h2>
        <div class="grid">
            {#each related as item (item.id)}
                <ShowcaseCard {item}/>
            {/each}
        </div>
    {/if}
</div>

<style lang="scss">
  .layout {
    display: grid;
    gap: 2rem;
    grid-template-columns: 1fr;
    margin-bottom: 3rem;

    @media (min-width: 760px) {
      grid-template-columns: 1fr 300px;
    }
  }

  aside {
    align-self: start;
    background: var(--blue);
    border-color: var(--blue-strong);
  }

  .aside-body {
    padding: 1.5rem;

    p {
      margin: 0 0 .75rem;
    }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    align-items: flex-start;
  }

  .price {
    font-size: 2rem;
    font-weight: 600;

    small {
      display: block;
      font-size: .8rem;
      font-weight: 400;
      color: var(--muted);
    }
  }
</style>
