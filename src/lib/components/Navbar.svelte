<script lang="ts">
    import {page} from '$app/state';
    import {settings} from '$lib/data';
    import {i18n, locales, t} from '$lib/i18n.svelte';

    const links = [
        {href: '/', key: 'nav.home'},
        {href: '/services', key: 'nav.services'},
        {href: '/showcase', key: 'nav.showcase'},
        {href: '/calculator', key: 'nav.calculator'},
        {href: '/contact', key: 'nav.contact'}
    ];

    const isActive = (href: string) =>
        href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
</script>

<nav>
    <a class="brand" href="/">{settings.brand}</a>
    <ul>
        {#each links as link}
            <li><a href={link.href} class:active={isActive(link.href)}>{t(link.key)}</a></li>
        {/each}
    </ul>
    <div class="lang" role="group" aria-label={t('lang.switch')}>
        {#each locales as l}
            <button class:active={i18n.locale === l} onclick={() => i18n.set(l)}>{l.toUpperCase()}</button>
        {/each}
    </div>
</nav>

<style lang="scss">
  nav {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: .5rem 1rem;
    padding: .75rem max(1rem, 4vw);
    background-color: var(--surface);
    border-bottom: 1px solid var(--border);
    color: var(--text);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .brand {
    font-weight: 600;
    font-size: 1.15rem;
    text-decoration: none;

    span {
      color: var(--blue-strong);
    }
  }

  ul {
    order: 3;
    width: 100%;
    display: flex;
    overflow-x: auto;
    scrollbar-width: none;

    @media (min-width: 900px) {
      order: 0;
      width: auto;
    }

    gap: .25rem;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  li a {
    display: block;
    white-space: nowrap;
    padding: .35rem .9rem;
    border-radius: 999px;
    text-decoration: none;
    color: var(--muted);

    &:hover {
      background: var(--blue);
      color: var(--text);
    }

    &.active {
      background: var(--pink);
      color: var(--text);
    }
  }

  .lang {
    display: flex;
    gap: .25rem;

    button {
      font: inherit;
      font-size: .8rem;
      padding: .2rem .6rem;
      border-radius: 999px;
      border: 1px solid var(--border);
      background: var(--surface);
      color: var(--muted);
      cursor: pointer;

      &.active {
        background: var(--blue);
        border-color: var(--blue-strong);
        color: var(--text);
      }
    }
  }
</style>
