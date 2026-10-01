<script lang="ts">
    import Seo from '$lib/components/Seo.svelte';
    import {services, showcase} from '$lib/data';
    import {t} from '$lib/i18n.svelte';
    import ServiceCard from '$lib/components/ServiceCard.svelte';
    import ShowcaseCard from '$lib/components/ShowcaseCard.svelte';

    const featured = showcase.slice(0, 3);
</script>

<Seo description={t('seo.home')}/>

<section class="hero">
    <div class="container">
        <h1>{t('home.title')}</h1>
        <p class="muted">{t('home.subtitle')}</p>
        <div class="actions">
            <a class="btn" href="/services">{t('home.cta.services')}</a>
            <a class="btn alt" href="/calculator">{t('home.cta.calculator')}</a>
            <a class="btn alt" href="/showcase">{t('home.cta.work')}</a>
        </div>
    </div>
</section>

<section class="container">
    <h2>{t('home.services')}</h2>
    <div class="grid">
        {#each services as service (service.slug)}
            <ServiceCard {service}/>
        {/each}
    </div>
</section>

<section class="container">
    <h2>{t('home.recent')}</h2>
    <div class="grid">
        {#each featured as item (item.id)}
            <ShowcaseCard {item}/>
        {/each}
    </div>
</section>

<section class="steps">
    <div class="container">
        <h2>{t('home.how')}</h2>
        <div class="grid">
            {#each [1, 2, 3] as n}
                <div><h3>{t(`home.step${n}.title`)}</h3><p class="muted">{t(`home.step${n}.text`)}</p></div>
            {/each}
        </div>
    </div>
</section>

<style lang="scss">
  .hero {
    background: linear-gradient(135deg, var(--pink), var(--blue));

    .container {
      padding-block: 3rem;

      @media (min-width: 640px) {
        padding-block: 5rem;
      }
    }

    h1 {
      font-size: clamp(2rem, 5vw, 3rem);
      max-width: 18ch;
    }

    p {
      max-width: 52ch;
      color: var(--text);
    }
  }

  .actions {
    display: flex;
    flex-wrap: wrap;
    gap: .75rem;
    margin-top: 1.5rem;
  }

  .steps {
    background: var(--pink);
    opacity: .9;

    p {
      margin: 0;
    }
  }
</style>
