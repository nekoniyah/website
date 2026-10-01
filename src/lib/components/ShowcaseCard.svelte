<script lang="ts">
    import type {ShowcaseItem} from '$lib/data';
    import {t, tr} from '$lib/i18n.svelte';

    const {item}: { item: ShowcaseItem } = $props();
</script>

<article class="card">
    <div class="thumb">
        {#if item.image}
            <img src={item.image} alt={tr(item.title)}/>
        {:else}
            <span>{tr(item.title).charAt(0)}</span>
        {/if}
    </div>
    <div class="body">
        <span class="badge">{t('cat.' + item.category)}</span>
        <h3>{tr(item.title)}</h3>
        <p class="muted">{tr(item.description)}</p>
        {#if item.tags?.length}
            <p class="tags">{item.tags.join(' · ')}</p>
        {/if}
        {#if item.url}
            <a class="btn alt" href={item.url} target="_blank" rel="noopener noreferrer">{t('showcase.visit')}</a>
        {/if}
    </div>
</article>

<style lang="scss">
  .thumb {
    aspect-ratio: 16 / 9;
    background: linear-gradient(135deg, var(--pink), var(--blue));
    display: grid;
    place-items: center;
    font-size: 2.5rem;
    color: var(--surface);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .body {
    padding: 1rem 1.25rem 1.25rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .25rem;
    flex: 1;

    h3, p {
      margin: 0;
    }
  }

  .tags {
    font-size: .85rem;
    color: var(--muted);
    margin-bottom: .5rem !important;
  }
</style>
