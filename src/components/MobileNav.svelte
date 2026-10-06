<script lang="ts">
  import { favorites } from '../stores/favorites';
  import {
    activeFilterCount,
    openFilterDrawer,
    selectedDay,
    view,
  } from '../stores/filters';
  import type { ViewMode } from '../types';

  function setViewMode(v: ViewMode) {
    if (v === 'grid' && $selectedDay === 'all') {
      selectedDay.set(7);
    }
    view.set(v);
  }
</script>

<nav class="mobile-nav" aria-label="Navegación principal para móviles">
  <button
    type="button"
    class="nav-item"
    class:active={$view === 'grid'}
    aria-pressed={$view === 'grid'}
    on:click={() => setViewMode('grid')}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
      <rect x="3" y="4" width="18" height="18" rx="2" stroke-width="2" />
      <line x1="3" y1="10" x2="21" y2="10" stroke-width="2" />
      <line x1="9" y1="4" x2="9" y2="22" stroke-width="2" />
      <line x1="15" y1="4" x2="15" y2="22" stroke-width="2" />
    </svg>
    <span class="lbl-nav">Grilla</span>
  </button>

  <button
    type="button"
    class="nav-item"
    class:active={$view === 'list'}
    aria-pressed={$view === 'list'}
    on:click={() => setViewMode('list')}
  >
    <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
      <line x1="8" y1="6" x2="21" y2="6" stroke-width="2" stroke-linecap="round" />
      <line x1="8" y1="12" x2="21" y2="12" stroke-width="2" stroke-linecap="round" />
      <line x1="8" y1="18" x2="21" y2="18" stroke-width="2" stroke-linecap="round" />
      <circle cx="4" cy="6" r="1.5" />
      <circle cx="4" cy="12" r="1.5" />
      <circle cx="4" cy="18" r="1.5" />
    </svg>
    <span class="lbl-nav">Lista</span>
  </button>

  <button
    type="button"
    class="nav-item"
    class:active={$view === 'agenda'}
    aria-pressed={$view === 'agenda'}
    on:click={() => setViewMode('agenda')}
  >
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
        <path
          d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
          stroke-width="2"
          stroke-linejoin="round"
        />
      </svg>
      {#if $favorites.size > 0}
        <span class="badge">{$favorites.size}</span>
      {/if}
    </div>
    <span class="lbl-nav">Mi agenda</span>
  </button>

  <button
    type="button"
    class="nav-item"
    aria-label={`Filtros (${$activeFilterCount} activos)`}
    on:click={openFilterDrawer}
  >
    <div class="icon-wrap">
      <svg viewBox="0 0 24 24" aria-hidden="true" class="icon">
        <line x1="4" y1="21" x2="4" y2="14" stroke-width="2" stroke-linecap="round" />
        <line x1="4" y1="10" x2="4" y2="3" stroke-width="2" stroke-linecap="round" />
        <line x1="12" y1="21" x2="12" y2="12" stroke-width="2" stroke-linecap="round" />
        <line x1="12" y1="8" x2="12" y2="3" stroke-width="2" stroke-linecap="round" />
        <line x1="20" y1="21" x2="20" y2="16" stroke-width="2" stroke-linecap="round" />
        <line x1="20" y1="12" x2="20" y2="3" stroke-width="2" stroke-linecap="round" />
        <line x1="1" y1="14" x2="7" y2="14" stroke-width="2" stroke-linecap="round" />
        <line x1="9" y1="8" x2="15" y2="8" stroke-width="2" stroke-linecap="round" />
        <line x1="17" y1="16" x2="23" y2="16" stroke-width="2" stroke-linecap="round" />
      </svg>
      {#if $activeFilterCount > 0}
        <span class="badge filter-badge">{$activeFilterCount}</span>
      {/if}
    </div>
    <span class="lbl-nav">Filtros</span>
  </button>
</nav>

<style>
  .mobile-nav {
    display: none;
  }

  @media (max-width: 640px) {
    .mobile-nav {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      z-index: 45;
      display: flex;
      justify-content: space-around;
      align-items: center;
      background: var(--surface);
      border-top: 1px solid var(--line);
      padding-top: 6px;
      padding-bottom: max(6px, env(safe-area-inset-bottom, 6px));
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
    }

    .nav-item {
      all: unset;
      box-sizing: border-box;
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 3px;
      min-height: 48px;
      padding: 4px 0;
      cursor: pointer;
      color: var(--ink-2);
      transition: color 0.15s ease, transform 0.1s ease;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;
    }

    .nav-item:active {
      transform: scale(0.95);
    }

    .nav-item.active {
      color: var(--ink);
    }

    .nav-item.active .icon {
      stroke: var(--ink);
      fill: color-mix(in srgb, var(--ink) 12%, transparent);
    }

    .icon-wrap {
      position: relative;
      display: inline-flex;
    }

    .icon {
      width: 22px;
      height: 22px;
      stroke: currentColor;
      fill: none;
      stroke-width: 2;
      transition: stroke 0.15s ease;
    }

    .lbl-nav {
      font-family: var(--f-body);
      font-size: 11px;
      font-weight: 600;
      letter-spacing: -0.01em;
    }

    .badge {
      position: absolute;
      top: -4px;
      right: -10px;
      min-width: 16px;
      height: 16px;
      padding: 0 4px;
      border-radius: 999px;
      background: var(--coral);
      color: #FFFFFF;
      font-family: var(--f-mono);
      font-size: 10px;
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .badge.filter-badge {
      background: var(--ink);
      color: var(--bg);
    }
  }
</style>
