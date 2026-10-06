<script lang="ts">
  import { DAYS, OFF, PX, ROOM_ORDER, ROOMS } from '../data/constants';
  import { sessions } from '../data/sessions';
  import { favorites, toggleFavorite } from '../stores/favorites';
  import {
    activeRooms,
    activeTopics,
    matchSession,
    onlySpanish,
    searchQuery,
    selectedDay,
  } from '../stores/filters';
  import { openSheet } from '../stores/sheet';
  import { showToast } from '../stores/toast';
  import type { DayId, Session } from '../types';
  import { fmt, plural } from '../utils/time';

  $: day = ($selectedDay === 'all' ? 7 : $selectedDay) as DayId;
  $: daySessions = sessions.filter((s) => s.day === day);
  $: activeRoomsInDay = ROOM_ORDER.filter((r) =>
    daySessions.some((s) => s.room === r)
  );

  $: minMinute = daySessions.length
    ? Math.min(...daySessions.map((s) => s.a))
    : 540;
  $: maxMinute = daySessions.length
    ? Math.max(...daySessions.map((s) => s.b))
    : 1080;

  $: t0 = Math.floor(minMinute / 60) * 60;
  $: t1 = Math.ceil(maxMinute / 60) * 60;
  $: totalHeight = OFF + (t1 - t0) * PX + 10;

  $: hourMarks = (() => {
    const list: number[] = [];
    for (let m = t0; m <= t1; m += 60) {
      list.push(m);
    }
    return list;
  })();

  $: isFiltered =
    $activeRooms.size > 0 ||
    $activeTopics.size > 0 ||
    $onlySpanish ||
    $searchQuery !== '';

  $: matchCount = daySessions.filter((s) =>
    matchSession(s, $activeRooms, $activeTopics, $onlySpanish, $searchQuery)
  ).length;

  $: countText =
    (isFiltered
      ? `${matchCount} de ${plural(daySessions.length)} coinciden con los filtros; el resto se atenúa. `
      : `${plural(daySessions.length)} el ${DAYS[day].w.toLowerCase()} ${day}. `) +
    'Tocá una charla para ver el detalle y la estrella para guardarla.';

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

<p class="count" id="count">{countText}</p>

<div
  class="gridwrap"
  tabindex="0"
  role="region"
  aria-label={`Grilla de horarios del ${DAYS[day].w.toLowerCase()}`}
>
  <div
    class="tt"
    style={`--n: ${activeRoomsInDay.length}; --H: ${totalHeight}px; --hr: ${60 * PX}px; --hh: ${30 * PX}px; --off: ${OFF}px;`}
  >
    <div class="hc corner"></div>
    {#each activeRoomsInDay as r}
      <div class={`hc r-${r}`}>
        <span class="dot">{ROOMS[r].c}</span>
        {ROOMS[r].n}
        <span class="rc">{daySessions.filter((s) => s.room === r).length}</span>
      </div>
    {/each}

    <div class="gut">
      {#each hourMarks as m}
        <span style={`top: ${OFF + (m - t0) * PX}px`}>{fmt(m)}</span>
      {/each}
    </div>

    {#each activeRoomsInDay as r}
      <div class={`lane r-${r}`}>
        {#each daySessions.filter((s) => s.room === r) as s}
          {@const isFav = $favorites.has(s.id)}
          {@const isMatch = matchSession(
            s,
            $activeRooms,
            $activeTopics,
            $onlySpanish,
            $searchQuery
          )}
          {@const blockTop = OFF + (s.a - t0) * PX}
          {@const blockHeight = Math.max(s.dur * PX - 4, 64)}
          <article
            class={`blk r-${s.room}${isFav ? ' fav' : ''}${!isMatch ? ' dim' : ''}`}
            data-card={s.id}
            style={`top: ${blockTop}px; --h: ${blockHeight}px;`}
          >
            <div class="t">
              <span>{fmt(s.a)}–{fmt(s.b)}</span>
              {#if s.es}
                <span class="tag" title="Español">ES</span>
              {/if}
              {#if s.kind === 'l'}
                <span class="tag" title="Lightning talk">LT</span>
              {/if}
              <button
                type="button"
                class="star"
                data-fav={s.id}
                aria-pressed={isFav}
                aria-label={isFav ? 'Quitar de mi agenda' : 'Agregar a mi agenda'}
                title={isFav ? 'Quitar de mi agenda' : 'Agregar a mi agenda'}
                on:click|stopPropagation={() => handleToggleFav(s)}
              >
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    d="M12 3.2l2.7 5.6 6.1.8-4.5 4.2 1.1 6.1L12 17l-5.4 2.9 1.1-6.1L3.2 9.6l6.1-.8z"
                    stroke-linejoin="round"
                  />
                </svg>
              </button>
            </div>
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
          </article>
        {/each}
      </div>
    {/each}
  </div>
</div>
