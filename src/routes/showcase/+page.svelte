<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {categories, showcase, type Category} from '$lib/data';
    import {t} from '$lib/i18n.svelte';
    import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';

    let filter = $state<Category | 'all'>('all');
    const items = $derived(filter === 'all' ? showcase : showcase.filter((s) => s.category === filter));
</script>

<Seo title={t('showcase.title')} description={t('seo.showcase')}/>

<div class="container">
    <h1>{t('showcase.title')}</h1>
    <p class="muted">{t('showcase.subtitle')}</p>

    <div class="filters">
        <button class:active={filter === 'all'} onclick={() => (filter = 'all')}>{t('cat.all')}</button>
        {#each categories as c}
            <button class:active={filter === c} onclick={() => (filter = c)}>{t('cat.' + c)}</button>
        {/each}
    </div>

    <div class="grid">
        {#each items as item (item.id)}
            <ShowcaseCard {item}/>
        {:else}
            <p class="muted">{t('showcase.empty')}</p>
        {/each}
    </div>
</div>

<style lang="scss">
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: .5rem;
    margin: 1.5rem 0;
  }

  button {
    font: inherit;
    padding: .35rem 1rem;
    border-radius: 999px;
    border: 1px solid var(--border);
    background: var(--surface);
    color: var(--muted);
    cursor: pointer;

    &:hover {
      background: var(--blue);
    }

    &.active {
      background: var(--pink);
      border-color: var(--pink-strong);
      color: var(--text);
    }
  }
</style>
