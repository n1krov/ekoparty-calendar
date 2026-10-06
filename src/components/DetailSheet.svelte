<script lang="ts">
  import { onMount, tick } from 'svelte';
  import { DAYS, KINDS, ROOMS, SITE, TOPICS } from '../data/constants';
  import { byId } from '../data/sessions';
  import { getSessionSpecialTracks } from '../data/special-tracks';
  import { favorites, getSessionConflicts, toggleFavorite } from '../stores/favorites';
  import { closeSheet, sheetState } from '../stores/sheet';
  import { showToast } from '../stores/toast';
  import { durTxt, fmt } from '../utils/time';

  let panelElement: HTMLElement | null = null;
  let closeBtnElement: HTMLButtonElement | null = null;

  $: activeSession = $sheetState.sessionId ? byId[$sheetState.sessionId] : null;
  $: isFav = activeSession ? $favorites.has(activeSession.id) : false;
  $: conflicts = activeSession ? getSessionConflicts(activeSession, $favorites) : [];

  $: if ($sheetState.isOpen && activeSession) {
    tick().then(() => {
      closeBtnElement?.focus();
    });
  }

  function handleScrimClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      closeSheet();
    }
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!$sheetState.isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeSheet();
      return;
    }

    if (e.key === 'Tab' && panelElement) {
      const focusable = Array.from(
        panelElement.querySelectorAll<HTMLElement>('button, a[href]')
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  }

  function handleToggleFav() {
    if (!activeSession) return;
    const res = toggleFavorite(activeSession.id);
    if (res.isAdded) {
      showToast(
        res.hasConflict
          ? 'Agregada. Se cruza con otra charla de tu agenda.'
          : 'Agregada a Mi agenda'
      );
    } else {
      showToast('Quitada de Mi agenda');
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $sheetState.isOpen && activeSession}
  <div
    class="scrim"
    id="sheet"
    role="presentation"
    on:click={handleScrimClick}
  >
    <div
      class="panel"
      id="panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="sh-title"
      bind:this={panelElement}
    >
      <button
        type="button"
        class="sheet-drag-handle-wrap"
        aria-label="Cerrar detalle"
        on:click={closeSheet}
      >
        <span class="drag-handle"></span>
      </button>

      <div class={`ph r-${activeSession.room}`}>
        <span class="dot">{ROOMS[activeSession.room].c}</span>
        <span class="pr">{ROOMS[activeSession.room].n}</span>
        <button
          type="button"
          class="x"
          data-act="close"
          aria-label="Cerrar"
          bind:this={closeBtnElement}
          on:click={closeSheet}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <p class="pt">
        {DAYS[activeSession.day].w} {DAYS[activeSession.day].d} · {fmt(activeSession.a)}–{fmt(activeSession.b)} · {durTxt(activeSession.dur)}
      </p>

      <h2 id="sh-title">{activeSession.title}</h2>

      <dl>
        <dt>Oradores</dt>
        <dd>
          {#if activeSession.who.length}
            {#each activeSession.who as speaker, i}
              {speaker}{#if i < activeSession.who.length - 1}<br />{/if}
            {/each}
          {:else}
            <span style="color: var(--ink-2)">No figuraba en la impresión</span>
          {/if}
        </dd>

        {#if activeSession.track}
          <dt>Espacio</dt>
          <dd>{activeSession.track}</dd>
        {/if}

        {#if activeSession.kind}
          <dt>Formato</dt>
          <dd>{KINDS[activeSession.kind] || ''}</dd>
        {/if}

        {#if activeSession.es}
          <dt>Idioma</dt>
          <dd>Español</dd>
        {/if}

        {#if activeSession.tags.length}
          <dt>Temas</dt>
          <dd>{activeSession.tags.map((t) => TOPICS[t]).join(' · ')}</dd>
        {/if}

        {#if getSessionSpecialTracks(activeSession.id).length}
          <dt>Foco</dt>
          <dd>
            {#each getSessionSpecialTracks(activeSession.id) as st}
              <span class={`track-inline-badge track-${st.id}`}>{st.label}</span>
            {/each}
          </dd>
        {/if}
      </dl>

      {#if activeSession.cut}
        <p class="cutn">
          El título aparece cortado en la impresión original. El texto completo está en el sitio oficial.
        </p>
      {/if}

      {#if conflicts.length > 0}
        <p class="warn">
          <span class="pill">Se cruza</span>
          con {conflicts
            .map(
              (o) =>
                `${o.title} (${ROOMS[o.room].n}, ${fmt(o.a)}–${fmt(o.b)})`
            )
            .join('; ')}
        </p>
      {/if}

      <div class="pa sheet-actions-sticky">
        <button
          type="button"
          class="btn"
          data-fav={activeSession.id}
          aria-pressed={isFav}
          on:click={handleToggleFav}
        >
          {isFav ? 'Quitar de mi agenda' : 'Agregar a mi agenda'}
        </button>

        <a
          class="lnk"
          href={SITE}
          target="_blank"
          rel="noopener"
        >
          Ver el sitio oficial ↗
        </a>
      </div>
    </div>
  </div>
{/if}
