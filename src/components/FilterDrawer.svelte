<script lang="ts">
  import { ROOM_ORDER, ROOMS, TOPICS } from '../data/constants';
  import { sessions } from '../data/sessions';
  import { SPECIAL_TRACK_LIST } from '../data/special-tracks';
  import {
    activeFilterCount,
    activeRooms,
    activeSpecialTrack,
    activeTopics,
    closeFilterDrawer,
    isFilterDrawerOpen,
    matchSession,
    onlySpanish,
    searchQuery,
    selectedDay,
    setSearchQuery,
    toggleRoom,
    toggleSpanish,
    toggleSpecialTrack,
    toggleTopic,
    clearAllFilters,
  } from '../stores/filters';
  import type { RoomId, TopicId } from '../types';
  import { plural } from '../utils/time';

  const topicsList = Object.keys(TOPICS) as TopicId[];

  let inputEl: HTMLInputElement | null = null;
  let rawSearch = '';

  $: if ($isFilterDrawerOpen) {
    rawSearch = $searchQuery;
  }

  $: filteredCount = sessions.filter((s) => {
    if ($selectedDay !== 'all' && s.day !== $selectedDay) return false;
    return matchSession(
      s,
      $activeRooms,
      $activeTopics,
      $onlySpanish,
      $searchQuery,
      $activeSpecialTrack
    );
  }).length;

  function handleInput(e: Event) {
    const target = e.target as HTMLInputElement;
    rawSearch = target.value;
    setSearchQuery(target.value);
  }

  function handleKeydown(e: KeyboardEvent) {
    if (!$isFilterDrawerOpen) return;
    if (e.key === 'Escape') {
      e.preventDefault();
      closeFilterDrawer();
    }
  }

  function handleScrimClick(e: MouseEvent) {
    if (e.target === e.currentTarget) {
      closeFilterDrawer();
    }
  }
</script>

<svelte:window on:keydown={handleKeydown} />

{#if $isFilterDrawerOpen}
  <div
    class="drawer-scrim"
    role="presentation"
    on:click={handleScrimClick}
  >
    <div
      class="drawer-panel"
      role="dialog"
      aria-modal="true"
      aria-labelledby="drawer-title"
    >
      <div class="drag-handle-wrap" on:click={closeFilterDrawer}>
        <div class="drag-handle"></div>
      </div>

      <div class="drawer-header">
        <h2 id="drawer-title" class="drawer-title">
          Filtros
          {#if $activeFilterCount > 0}
            <span class="active-badge">{$activeFilterCount}</span>
          {/if}
        </h2>
        <button
          type="button"
          class="drawer-close"
          aria-label="Cerrar filtros"
          on:click={closeFilterDrawer}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 5l14 14M19 5L5 19" stroke-linecap="round" />
          </svg>
        </button>
      </div>

      <div class="drawer-body">
        <!-- Search bar inside drawer -->
        <div class="drawer-search">
          <label class="sr" for="drawer-q">Buscar charla, orador o tema</label>
          <input
            id="drawer-q"
            type="search"
            placeholder="Buscar charla, orador, sala o tema..."
            autocomplete="off"
            value={rawSearch}
            on:input={handleInput}
            bind:this={inputEl}
          />
        </div>

        <!-- Special Tracks (Perfiles destacados) -->
        <div class="drawer-group">
          <span class="drawer-group-title">Foco por especialidad</span>
          <div class="drawer-chips">
            {#each SPECIAL_TRACK_LIST as track}
              <button
                type="button"
                class={`chip special-chip track-${track.id}`}
                aria-pressed={$activeSpecialTrack === track.id}
                on:click={() => toggleSpecialTrack(track.id)}
              >
                <span>{track.icon}</span>
                {track.label}
              </button>
            {/each}
          </div>
        </div>

        <!-- Rooms -->
        <div class="drawer-group">
          <span class="drawer-group-title">Salas</span>
          <div class="drawer-chips">
            {#each ROOM_ORDER as roomId}
              <button
                type="button"
                class="chip"
                aria-pressed={$activeRooms.has(roomId)}
                on:click={() => toggleRoom(roomId)}
              >
                <span class={`dot r-${roomId}`}>{ROOMS[roomId].c}</span>
                {ROOMS[roomId].n}
              </button>
            {/each}
          </div>
        </div>

        <!-- Topics -->
        <div class="drawer-group">
          <span class="drawer-group-title">Temas</span>
          <div class="drawer-chips">
            {#each topicsList as topicId}
              <button
                type="button"
                class="chip"
                aria-pressed={$activeTopics.has(topicId)}
                on:click={() => toggleTopic(topicId)}
              >
                {TOPICS[topicId]}
              </button>
            {/each}
          </div>
        </div>

        <!-- Language toggle -->
        <div class="drawer-group">
          <div class="drawer-chips">
            <button
              type="button"
              class="chip"
              aria-pressed={$onlySpanish}
              on:click={toggleSpanish}
            >
              Solo en español
            </button>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="drawer-footer">
        {#if $activeFilterCount > 0}
          <button
            type="button"
            class="btn-clear"
            on:click={clearAllFilters}
          >
            Limpiar filtros
          </button>
        {/if}
        <button
          type="button"
          class="btn-apply"
          on:click={closeFilterDrawer}
        >
          Ver {plural(filteredCount)}
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .drawer-scrim {
    position: fixed;
    inset: 0;
    z-index: 60;
    background: color-mix(in srgb, #05080C 55%, transparent);
    display: flex;
    align-items: flex-end;
    justify-content: center;
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }

  .drawer-panel {
    width: 100%;
    max-width: 540px;
    max-height: 85vh;
    background: var(--surface);
    color: var(--ink);
    border-radius: 20px 20px 0 0;
    border-top: 1px solid var(--line);
    display: flex;
    flex-direction: column;
    box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.25);
    animation: slideUp 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }
    to {
      transform: translateY(0);
    }
  }

  .drag-handle-wrap {
    width: 100%;
    padding: 10px 0 4px;
    display: flex;
    justify-content: center;
    cursor: grab;
  }

  .drag-handle {
    width: 36px;
    height: 4px;
    border-radius: 999px;
    background: var(--line-2, #888888);
    opacity: 0.5;
  }

  .drawer-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px 12px;
    border-bottom: 1px solid var(--line);
  }

  .drawer-title {
    margin: 0;
    font-family: var(--f-display);
    font-size: 20px;
    font-weight: 800;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .active-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 20px;
    height: 20px;
    padding: 0 6px;
    border-radius: 999px;
    background: var(--coral);
    color: #FFFFFF;
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 700;
  }

  .drawer-close {
    all: unset;
    box-sizing: border-box;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 8px;
    cursor: pointer;
    color: var(--ink);
  }

  .drawer-close:hover {
    background: var(--surface-2);
  }

  .drawer-close svg {
    width: 20px;
    height: 20px;
    fill: none;
    stroke: currentColor;
    stroke-width: 2;
  }

  .drawer-body {
    flex: 1;
    overflow-y: auto;
    padding: 16px 20px;
    display: flex;
    flex-direction: column;
    gap: 18px;
    -webkit-overflow-scrolling: touch;
  }

  .drawer-search input {
    width: 100%;
    box-sizing: border-box;
    padding: 12px 16px;
    border: 1px solid var(--line);
    border-radius: 999px;
    background: var(--surface-2, var(--surface));
    color: var(--ink);
    font-size: 14px;
    font-family: var(--f-body);
  }

  .drawer-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .drawer-group-title {
    font-family: var(--f-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--ink-2);
  }

  .drawer-chips {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .drawer-footer {
    display: flex;
    gap: 10px;
    align-items: center;
    padding: 12px 20px max(14px, env(safe-area-inset-bottom, 14px));
    border-top: 1px solid var(--line);
    background: var(--surface);
  }

  .btn-clear {
    all: unset;
    box-sizing: border-box;
    padding: 12px 16px;
    border: 1px dashed var(--line);
    border-radius: 999px;
    font-family: var(--f-body);
    font-size: 13px;
    font-weight: 600;
    color: var(--ink-2);
    cursor: pointer;
    min-height: 44px;
    text-align: center;
  }

  .btn-clear:hover {
    border-color: var(--ink);
    color: var(--ink);
  }

  .btn-apply {
    all: unset;
    box-sizing: border-box;
    flex: 1;
    background: var(--ink);
    color: var(--bg);
    border-radius: 999px;
    font-family: var(--f-body);
    font-size: 14px;
    font-weight: 700;
    text-align: center;
    padding: 12px 20px;
    cursor: pointer;
    min-height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .btn-apply:hover {
    filter: brightness(1.1);
  }
</style>
