<script lang="ts">
    import {startingPrice, type Service} from '$lib/data';
    import {money, t, tr} from '$lib/i18n.svelte';

    const {service}: { service: Service } = $props();
</script>

<article class="card">
    <div class="body">
        <h3>{tr(service.name)}</h3>
        <p class="muted">{tr(service.tagline)}</p>
        <p class="price"><small>{t('services.from')}</small> {money(startingPrice(service))}</p>
        <ul>
            {#each tr(service.features).slice(0, 3) as f}
                <li>{f}</li>
            {/each}
        </ul>
        <a class="btn" href="/services/{service.slug}">{t('services.details')}</a>
    </div>
</article>

<style lang="scss">
  .body {
    padding: 1.5rem;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: .5rem;
    height: 100%;
    box-sizing: border-box;
    border-top: 4px solid var(--pink-strong);

    h3, p {
      margin: 0;
    }
  }

  .price {
    font-size: 1.6rem;
    font-weight: 600;

    small {
      font-size: .8rem;
      font-weight: 400;
      color: var(--muted);
    }
  }

  ul {
    margin: 0 0 1rem;
    padding-left: 1.1rem;
    color: var(--muted);
    flex: 1;
  }
</style>
