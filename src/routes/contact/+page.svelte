<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {onMount} from 'svelte';
    import {decodeSelection, estimate, services, settings, type Selection} from '$lib/data';
    import {money, t, tr} from '$lib/i18n.svelte';

    let name = $state('');
    let email = $state('');
    let service = $state(services[0].slug);
    let message = $state('');
    let selection = $state<Selection>({});

    // Query params are unavailable while prerendering, so read them on the client.
    onMount(() => {
        const params = new URLSearchParams(window.location.search);
        const preset = params.get('service');
        if (preset && services.some((s) => s.slug === preset)) service = preset;
        selection = decodeSelection(params.get('features'));
    });

    const current = $derived(services.find((s) => s.slug === service) ?? services[0]);

    // Estimate coming from the calculator, if any.
    const estimateText = $derived.by(() => {
        const {lines, total, hours} = estimate(current, selection);
        if (!lines.length) return '';
        const features = lines.map((l) => tr(l.feature.label) + (l.quantity > 1 ? ` ×${l.quantity}` : '')).join(', ');
        return t('contact.estimate', {features, total: money(total), hours});
    });

    const href = $derived.by(() => {
        const subject = t('contact.subject', {service: tr(current.name)});
        const body = [
            `${t('contact.name')}: ${name}`,
            `${t('contact.email')}: ${email}`,
            `${t('contact.service')}: ${tr(current.name)}`,
            ...(estimateText ? [estimateText] : []),
            '',
            message
        ].join('\n');
        return `mailto:${settings.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
</script>

<Seo title={t('contact.title')} description={t('seo.contact')}/>

<div class="container narrow">
    <h1>{t('contact.title')}</h1>
    <p class="muted">{t('contact.subtitle')}</p>

    <form onsubmit={(e) => { e.preventDefault(); window.location.href = href; }}>
        <label>{t('contact.name')} <input bind:value={name} required/></label>
        <label>{t('contact.email')} <input type="email" bind:value={email} required/></label>
        <label>{t('contact.service')}
            <select bind:value={service}>
                {#each services as s}
                    <option value={s.slug}>{tr(s.name)}</option>
                {/each}
            </select>
        </label>
        {#if estimateText}
            <p class="estimate">{estimateText}</p>
        {/if}
        <label>{t('contact.details')} <textarea rows="6" bind:value={message} required></textarea></label>
        <button class="btn" type="submit">{t('contact.send')}</button>
    </form>

    <h2>{t('faq.title')}</h2>
    {#each [1, 2, 3] as n}
        <details><summary>{t(`faq.q${n}`)}</summary><p class="muted">{t(`faq.a${n}`)}</p></details>
    {/each}
</div>

<style lang="scss">
  .narrow {
    max-width: 640px;
  }

  form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 3rem;
  }

  label {
    display: flex;
    flex-direction: column;
    gap: .3rem;
    font-size: .9rem;
  }

  input, select, textarea {
    font: inherit;
    padding: .6rem .8rem;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--surface);
    color: var(--text);

    &:focus {
      outline: 2px solid var(--blue-strong);
      border-color: transparent;
    }
  }

  .estimate {
    margin: 0;
    padding: .75rem 1rem;
    background: var(--blue);
    border-radius: 10px;
    font-size: .9rem;
  }

  .btn {
    align-self: flex-start;
  }

  details {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: .75rem 1rem;
    margin-bottom: .5rem;

    p {
      margin: .5rem 0 0;
    }
  }
</style>
