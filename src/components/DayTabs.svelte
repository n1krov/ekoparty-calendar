<script lang="ts">
  import { DAYS, ROOM_ORDER } from '../data/constants';
  import { sessions } from '../data/sessions';
  import { selectedDay, view } from '../stores/filters';
  import type { DayId, SelectedDay } from '../types';
  import { fmt, plural } from '../utils/time';

  const dayNumbers: DayId[] = [7, 8, 9];

  interface DayStat {
    day: DayId;
    count: number;
    a: number;
    b: number;
    bars: Array<{
      room: string;
      top: number;
      left: string;
      width: string;
    }>;
  }

  const dayStats: DayStat[] = dayNumbers.map((d) => {
    const list = sessions.filter((s) => s.day === d);
    const startMin = Math.min(...list.map((s) => s.a));
    const endMin = Math.max(...list.map((s) => s.b));
    const t0 = Math.floor(startMin / 60) * 60;
    const t1 = Math.ceil(endMin / 60) * 60;
    const span = t1 - t0;

    const bars = list.map((s) => ({
      room: s.room,
      top: ROOM_ORDER.indexOf(s.room) * 7,
      left: `${((s.a - t0) / span * 100).toFixed(2)}%`,
      width: `calc(${((s.dur / span * 100)).toFixed(2)}% - 1.5px)`,
    }));

    return {
      day: d,
      count: list.length,
      a: startMin,
      b: endMin,
      bars,
    };
  });

  function selectDay(d: SelectedDay) {
    selectedDay.set(d);
  }
</script>

<div class="days" id="days" role="tablist" aria-label="Día">
  {#each dayStats as stat}
    <button
      type="button"
      class="day"
      role="tab"
      data-day={stat.day}
      aria-selected={$selectedDay === stat.day}
      on:click={() => selectDay(stat.day)}
    >
      <span class="dn">0{stat.day}</span>
      <span class="dw">
        <span class="wf">{DAYS[stat.day].w}</span>
        <span class="ws">{DAYS[stat.day].s}</span>
        <small>octubre</small>
      </span>
      <span class="dm">
        <span>{plural(stat.count)}</span>
        <span class="rng"> · {fmt(stat.a)}–{fmt(stat.b)}</span>
      </span>
      <span class="mini" aria-hidden="true">
        {#each stat.bars as bar}
          <i
            class={`r-${bar.room}`}
            style={`top: ${bar.top}px; left: ${bar.left}; width: ${bar.width};`}
          ></i>
        {/each}
      </span>
    </button>
  {/each}

  {#if $view !== 'grid'}
    <button
      type="button"
      class="day all"
      role="tab"
      data-day="all"
      aria-selected={$selectedDay === 'all'}
      on:click={() => selectDay('all')}
    >
      <span class="dw">
        <span class="wf">Todos</span>
        <span class="ws">Todos</span>
        <small>los días</small>
      </span>
      <span class="dm">{sessions.length}</span>
    </button>
  {/if}
</div>
