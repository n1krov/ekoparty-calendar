<script lang="ts">
  import { DAYS, KINDS, ROOMS, TOPICS } from '../data/constants';
  import { sessions } from '../data/sessions';
  import { getSessionSpecialTracks } from '../data/special-tracks';
  import { favorites, toggleFavorite } from '../stores/favorites';
  import {
    activeRooms,
    activeSpecialTrack,
    activeTopics,
    clearAllFilters,
    matchSession,
    onlySpanish,
    searchQuery,
    selectedDay,
  } from '../stores/filters';
  import { openSheet } from '../stores/sheet';
  import { showToast } from '../stores/toast';
  import type { DayId, Session } from '../types';
  import { compareSessions } from '../utils/overlap';
  import { durTxt, fmt, plural } from '../utils/time';

  interface TimeSlot {
    time: number;
    list: Session[];
  }

  interface DayGroup {
    day: DayId;
    slots: TimeSlot[];
    count: number;
  }

  $: targetDays = (
    $selectedDay === 'all' ? [7, 8, 9] : [$selectedDay]
  ) as DayId[];

  $: dayGroups = targetDays
    .map((d) => {
      const filtered = sessions
        .filter(
          (s) =>
            s.day === d &&
            matchSession(
              s,
              $activeRooms,
              $activeTopics,
              $onlySpanish,
              $searchQuery,
              $activeSpecialTrack
            )
        )
        .sort(compareSessions);

      const slots: TimeSlot[] = [];
      filtered.forEach((s) => {
        const lastSlot = slots[slots.length - 1];
        if (lastSlot && lastSlot.time === s.a) {
          lastSlot.list.push(s);
        } else {
          slots.push({ time: s.a, list: [s] });
        }
      });

      return {
        day: d,
        slots,
        count: filtered.length,
      };
    })
    .filter((g) => g.count > 0);

  $: totalItems = dayGroups.reduce((acc, g) => acc + g.count, 0);

  function handleToggleFav(s: Session) {
    const res = toggleFavorite(s.id);
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

  function handleOpen(s: Session, e: MouseEvent) {
    openSheet(s.id, e.currentTarget as HTMLElement);
  }
</script>

{#if totalItems === 0}
  <p class="count" id="count"></p>
  <div class="empty">
    <p class="et">Sin resultados</p>
    <p>Ninguna sesión coincide con los filtros.</p>
    <button type="button" class="btn" on:click={clearAllFilters}>
      Limpiar filtros
    </button>
  </div>
{:else}
  <p class="count" id="count">
    {plural(totalItems)}. Las que empiezan a la misma hora se muestran juntas para comparar salas.
  </p>

  {#each dayGroups as group}
    {#if targetDays.length > 1}
      <h2 class="dh">
        <span>{DAYS[group.day].w}</span> {DAYS[group.day].d}
      </h2>
    {/if}

    {#each group.slots as slot}
      <div class="slot">
        <div class="tm">{fmt(slot.time)}</div>
        <div class="items">
          {#each slot.list as s}
            {@const isFav = $favorites.has(s.id)}
            {@const metaString = [
              `${fmt(s.a)}–${fmt(s.b)}`,
              ROOMS[s.room].n,
              durTxt(s.dur),
              KINDS[s.kind] || '',
              s.es ? 'Español' : '',
              s.track,
            ]
              .filter(Boolean)
              .join(' · ')}
            <article class={`item r-${s.room}${isFav ? ' fav' : ''}`} data-card={s.id}>
              <span class="dot">{ROOMS[s.room].c}</span>
              <div>
                <h3>
                  <button
                    type="button"
                    class="open"
                    data-open={s.id}
                    on:click={(e) => handleOpen(s, e)}
                  >
                    {s.title}
                  </button>
                </h3>
                {#if s.who.length}
                  <p class="who">{s.who.join(' · ')}</p>
                {/if}
                <p class="meta">{metaString}</p>
                {@const specialTracks = getSessionSpecialTracks(s.id)}
                {#if s.tags.length || specialTracks.length}
                  <ul class="tp">
                    {#each specialTracks as st}
                      <li class={`track-pill pill-${st.id}`}>{st.icon} {st.badge}</li>
                    {/each}
                    {#each s.tags as tag}
                      <li>{TOPICS[tag]}</li>
                    {/each}
                  </ul>
                {/if}
              </div>
              <button
                type="button"
                class="star"
                data-fav={s.id}
                aria-pressed={isFav}
                aria-label={isFav ? 'Quitar de mi agenda' : 'Agregar a mi agenda'}
                title={isFav ? 'Quitar de mi agenda' : 'Agregar a mi agenda'}
                on:click={() => handleToggleFav(s)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </article>
          {/each}
        </div>
      </div>
    {/each}
  {/each}
{/if}
