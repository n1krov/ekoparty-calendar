<script lang="ts">
  import { ROOM_ORDER, ROOMS, TOPICS } from '../data/constants';
  import { favorites } from '../stores/favorites';
  import {
    activeRooms,
    activeTopics,
    clearAllFilters,
    onlySpanish,
    searchQuery,
    selectedDay,
    setSearchQuery,
    toggleRoom,
    toggleSpanish,
    toggleTopic,
    view,
  } from '../stores/filters';
  import type { RoomId, TopicId, ViewMode } from '../types';

  const topicsList = Object.keys(TOPICS) as TopicId[];

  $: isFiltered =
    $activeRooms.size > 0 ||
    $activeTopics.size > 0 ||
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
  </div>

  {#if $view !== 'agenda'}
    <div id="filters" class="toolbar" style="margin-top: 0">
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
