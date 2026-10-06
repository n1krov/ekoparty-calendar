<script lang="ts">
  import { ROOM_ORDER, ROOMS, TOPICS } from '../data/constants';
  import { SPECIAL_TRACK_LIST } from '../data/special-tracks';
  import { favorites } from '../stores/favorites';
  import {
    activeFilterCount,
    activeRooms,
    activeSpecialTrack,
    activeTopics,
    clearAllFilters,
    onlySpanish,
    openFilterDrawer,
    searchQuery,
    selectedDay,
    setSearchQuery,
    toggleRoom,
    toggleSpanish,
    toggleSpecialTrack,
    toggleTopic,
    view,
  } from '../stores/filters';
  import type { RoomId, TopicId, ViewMode } from '../types';

  const topicsList = Object.keys(TOPICS) as TopicId[];

  $: isFiltered =
    $activeRooms.size > 0 ||
    $activeTopics.size > 0 ||
    Boolean($activeSpecialTrack) ||
    $onlySpanish ||
    $searchQuery !== '';

  function setViewMode(v: ViewMode) {
    if (v === 'grid' && $selectedDay === 'all') {
      selectedDay.set(7);
    }
    view.set(v);
  }

  function handleSearchInput(e: Event) {
    const target = e.target as HTMLInputElement;
    setSearchQuery(target.value);
  }
</script>

<section class="toolbar" aria-label="Vista y filtros">
  <div class="row">
    <div class="seg" role="group" aria-label="Vista">
      <button
        type="button"
        data-view="grid"
        aria-pressed={$view === 'grid'}
        on:click={() => setViewMode('grid')}
      >
        Grilla
      </button>
      <button
        type="button"
        data-view="list"
        aria-pressed={$view === 'list'}
        on:click={() => setViewMode('list')}
      >
        Lista
      </button>
      <button
        type="button"
        data-view="agenda"
        aria-pressed={$view === 'agenda'}
        on:click={() => setViewMode('agenda')}
      >
        Mi agenda<span class="n" id="agn">{$favorites.size}</span>
      </button>
    </div>

    <div class="search-wrap">
      <div class="search">
        <label class="sr" for="q">Buscar charla, orador o tema</label>
        <input
          id="q"
          type="search"
          placeholder="Buscar charla, orador, sala o tema"
          autocomplete="off"
          value={$searchQuery}
          on:input={handleSearchInput}
        />
      </div>
      <button
        type="button"
        class="mobile-filter-btn"
        aria-label={`Abrir panel de filtros (${$activeFilterCount} activos)`}
        on:click={openFilterDrawer}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true" class="m-filt-icon">
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
        <span>Filtros</span>
        {#if $activeFilterCount > 0}
          <span class="m-filt-badge">{$activeFilterCount}</span>
        {/if}
      </button>
    </div>
  </div>

  {#if $view !== 'agenda'}
    <div id="filters" class="toolbar" style="margin-top: 0">
      <div class="fgroup">
        <span class="lbl">Foco</span>
        <div class="chips" id="special-tracks">
          {#each SPECIAL_TRACK_LIST as track}
            <button
              type="button"
              class={`chip special-chip track-${track.id}`}
              aria-pressed={$activeSpecialTrack === track.id}
              on:click={() => toggleSpecialTrack(track.id)}
              title={track.description}
            >
              <span>{track.icon}</span>
              {track.label}
            </button>
          {/each}
        </div>
      </div>

      <div class="fgroup">
        <span class="lbl">Sala</span>
        <div class="chips" id="rooms">
          {#each ROOM_ORDER as roomId}
            <button
              type="button"
              class="chip"
              data-room={roomId}
              aria-pressed={$activeRooms.has(roomId)}
              on:click={() => toggleRoom(roomId)}
            >
              <span class={`dot r-${roomId}`}>{ROOMS[roomId].c}</span>
              {ROOMS[roomId].n}
            </button>
          {/each}
        </div>
      </div>

      <div class="fgroup">
        <span class="lbl">Tema</span>
        <div class="chips" id="topics">
          {#each topicsList as topicId}
            <button
              type="button"
              class="chip"
              data-topic={topicId}
              aria-pressed={$activeTopics.has(topicId)}
              on:click={() => toggleTopic(topicId)}
            >
              {TOPICS[topicId]}
            </button>
          {/each}
        </div>
      </div>

      <div class="fgroup">
        <button
          type="button"
          class="chip"
          data-act="es"
          aria-pressed={$onlySpanish}
          on:click={toggleSpanish}
        >
          Solo en español
        </button>

        {#if isFiltered}
          <button
            type="button"
            class="chip clear"
            data-act="clear"
            id="clear"
            on:click={clearAllFilters}
          >
            Limpiar filtros
          </button>
        {/if}
      </div>
    </div>
  {/if}
</section>
