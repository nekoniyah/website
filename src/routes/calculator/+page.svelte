<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {onMount} from 'svelte';
    import {calcFeatures, encodeSelection, estimate, services, settings, type Selection} from '$lib/data';
    import {money, t, tr} from '$lib/i18n.svelte';

    let slug = $state(services[0].slug);
    let selected = $state<Selection>({});
    const service = $derived(services.find((s) => s.slug === slug) ?? services[0]);
    const available = $derived(calcFeatures.filter((f) => f.categories.includes(service.category)));
    const result = $derived(estimate(service, selected));
    const lines = $derived(result.lines);
    const quantities = $derived(new Map(lines.map((l) => [l.feature.id, l.quantity])));
    // Features that cannot be unticked because another chosen feature needs them.
    const locked = $derived(new Set(lines.flatMap((l) => l.feature.requires ?? [])));
    const days = $derived(Math.ceil(result.hours / settings.hoursPerDay));

    function setQuantity(id: string, quantity: number) {
        const {[id]: _, ...rest} = selected;
        selected = quantity > 0 ? {...rest, [id]: quantity} : rest;
    }

    // Query params are unavailable while prerendering, so read them on the client.
    onMount(() => {
        const preset = new URLSearchParams(window.location.search).get('service');
        if (preset && services.some((s) => s.slug === preset)) slug = preset;
    });


    const contactHref = $derived.by(() => {
        const params = new URLSearchParams({
            service: service.slug,
            features: encodeSelection(lines)
        });
        return `/contact?${params}`;
    });
</script>

<Seo title={t('calc.title')} description={t('seo.calculator')}/>

<div class="container">
    <h1>{t('calc.title')}</h1>
    <p class="muted">{t('calc.subtitle')}</p>

    <div class="layout">
        <div>
            <label class="field">{t('calc.service')}
                <select bind:value={slug} onchange={() => (selected = {})}>
                    {#each services as s (s.slug)}
                        <option value={s.slug}>{tr(s.name)}</option>
                    {/each}
                </select>
            </label>

            <h3>{t('calc.features')}</h3>
            {#each available as f (f.id)}
                {@const qty = quantities.get(f.id) ?? 0}
                {@const max = f.maxQuantity ?? 1}
                <div class="option" class:on={qty > 0}>
                    <div class="info">
                        <strong>{tr(f.label)}</strong>
                        {#if f.description}<small class="muted desc">{tr(f.description)}</small>{/if}
                        <small class="muted">+{money(f.price)} · {f.hours} h{max > 1 ? ` ${t('calc.each')}` : ''}</small>
                    </div>
                    {#if max > 1}
                        <div class="stepper" role="group" aria-label={tr(f.label)}>
                            <button type="button" aria-label={t('calc.less')} disabled={qty <= 0 || locked.has(f.id) && qty <= 1}
                                    onclick={() => setQuantity(f.id, qty - 1)}>−</button>
                            <span aria-live="polite">{qty}</span>
                            <button type="button" aria-label={t('calc.more')} disabled={qty >= max}
                                    onclick={() => setQuantity(f.id, qty + 1)}>+</button>
                        </div>
                    {:else}
                        <input type="checkbox" aria-label={tr(f.label)} checked={qty > 0} disabled={locked.has(f.id)}
                               onchange={(e) => setQuantity(f.id, e.currentTarget.checked ? 1 : 0)}/>
                    {/if}
                </div>
            {:else}
                <p class="muted">{t('calc.none')}</p>
            {/each}
        </div>

        <aside class="card">
            <div class="summary">
                {#if service.price > 0}
                    <p class="row"><span>{t('calc.base')} — {tr(service.name)}</span><span>{money(service.price)}</span></p>
                {/if}
                {#each lines as l (l.feature.id)}
                    <p class="row muted">
                        <span>{tr(l.feature.label)}{l.quantity > 1 ? ` ×${l.quantity}` : ''}</span>
                        <span>+{money(l.feature.price * l.quantity)}</span>
                    </p>
                {/each}
                {#if result.minimumApplied}
                    <p class="row muted"><span>{t('calc.minimum')}</span><span>{money(settings.minimumPrice)}</span></p>
                {/if}
                <hr/>
                <p class="label">{t('calc.total')}</p>
                <p class="total">{money(result.total)}</p>
                <p class="muted">{t('calc.hours', {hours: result.hours})} · {t('calc.days', {days})}</p>
                <p class="muted small">{t('calc.disclaimer')}</p>
                <a class="btn" href={contactHref}>{t('calc.send')}</a>
            </div>
        </aside>
    </div>
</div>

<style lang="scss">
  .layout {
    display: grid;
    gap: 1.5rem;
    margin-top: 1.5rem;
    grid-template-columns: minmax(0, 1fr);

    @media (min-width: 800px) {
      gap: 2rem;
      grid-template-columns: minmax(0, 1fr) 340px;
    }
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: .3rem;
    font-size: .9rem;
    margin-bottom: 1.5rem;
  }

  select {
    font: inherit;
    padding: .6rem .8rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);
  }

  .option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: .75rem 1rem;
    margin-bottom: .5rem;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;

    &.on {
      background: var(--pink);
      border-color: var(--pink-strong);
    }

    input[type=checkbox] {
      width: 1.25rem;
      height: 1.25rem;
      flex-shrink: 0;
      accent-color: var(--blue-strong);
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: .15rem;
    min-width: 0;

    small {
      font-size: .8rem;
    }
  }

  .stepper {
    display: flex;
    align-items: center;
    gap: .5rem;
    flex-shrink: 0;

    span {
      min-width: 1.5rem;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    button {
      width: 2.25rem;
      height: 2.25rem;
      border-radius: 50%;
      border: 1px solid var(--blue-strong);
      background: var(--blue);
      color: var(--text);
      font: inherit;
      font-size: 1.1rem;
      line-height: 1;
      cursor: pointer;

      &:disabled {
        opacity: .4;
        cursor: not-allowed;
      }
    }
  }

  aside {
    align-self: start;
    background: var(--blue);
    border-color: var(--blue-strong);

    @media (min-width: 800px) {
      position: sticky;
      top: 5rem;
    }
  }

  .summary {
    padding: 1.25rem;

    p {
      margin: 0 0 .5rem;
    }
  }

  .row {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
  }

  hr {
    border: 0;
    border-top: 1px solid var(--blue-strong);
    margin: 1rem 0;
  }

  .label {
    font-size: .85rem;
    color: var(--muted);
    margin: 0;
  }

  .total {
    font-size: 2.2rem;
    font-weight: 600;
  }

  .small {
    font-size: .8rem;
    margin-block: .75rem 1rem !important;
  }
</style>
