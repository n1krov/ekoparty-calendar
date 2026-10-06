<script lang="ts">
  import { DAYS, KINDS, ROOMS, TOPICS } from '../data/constants';
  import { sessions } from '../data/sessions';
  import { favorites, getSessionConflicts, toggleFavorite } from '../stores/favorites';
  import { selectedDay } from '../stores/filters';
  import { openSheet } from '../stores/sheet';
  import { showToast } from '../stores/toast';
  import type { DayId, Session } from '../types';
  import { copyTextToClipboard, formatAgendaText } from '../utils/clipboard';
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

  let fallbackText: string | null = null;

  $: targetDays = (
    $selectedDay === 'all' ? [7, 8, 9] : [$selectedDay]
  ) as DayId[];

  $: favSessionsInSelection = sessions
    .filter((s) => $favorites.has(s.id) && targetDays.includes(s.day))
    .sort(compareSessions);

  $: conflictCount = favSessionsInSelection.filter(
    (s) => getSessionConflicts(s, $favorites).length > 0
  ).length;

  $: dayGroups = targetDays
    .map((d) => {
      const dayFavs = favSessionsInSelection.filter((s) => s.day === d);
      const slots: TimeSlot[] = [];
      dayFavs.forEach((s) => {
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
        count: dayFavs.length,
      };
    })
    .filter((g) => g.count > 0);

  async function handleCopyAgenda() {
    const text = formatAgendaText(favSessionsInSelection);
    const success = await copyTextToClipboard(text);
    if (success) {
      fallbackText = null;
      showToast('Agenda copiada');
    } else {
      fallbackText = text;
      showToast('Seleccioná el texto y copialo');
    }
  }

  function handleToggleFav(s: Session) {
    toggleFavorite(s.id);
    showToast('Quitada de Mi agenda');
  }

  function handleOpen(s: Session, e: MouseEvent) {
    openSheet(s.id, e.currentTarget as HTMLElement);
  }
</script>

{#if $favorites.size === 0}
  <div class="empty">
    <p class="et">Tu agenda está vacía</p>
    <p>
      Tocá la estrella de cualquier charla en la grilla o la lista y aparece acá, con los cruces de horario marcados.
    </p>
  </div>
{:else if favSessionsInSelection.length === 0}
  <div class="empty">
    <p class="et">Nada guardado ese día</p>
    <p>Cambiá de día o sumá charlas desde la grilla o la lista.</p>
  </div>
{:else}
  <div class="aghead">
    <p>
      {plural(favSessionsInSelection.length)} guardadas
      {#if conflictCount > 0}
        · {conflictCount} con cruce de horario
      {/if}
    </p>
    <button
      type="button"
      class="btn ghost"
      data-act="copy"
      on:click={handleCopyAgenda}
    >
      Copiar como texto
    </button>
  </div>

  {#if fallbackText}
    <textarea
      id="agtxt"
      readonly
      aria-label="Tu agenda en texto"
      value={fallbackText}
    ></textarea>
  {/if}

  {#each dayGroups as group}
    <h2 class="dh">
      <span>{DAYS[group.day].w}</span> {DAYS[group.day].d}
    </h2>

    {#each group.slots as slot}
      <div class="slot">
        <div class="tm">{fmt(slot.time)}</div>
        <div class="items">
          {#each slot.list as s}
            {@const conflicts = getSessionConflicts(s, $favorites)}
            {@const metaString = [
              `${fmt(s.a)}–${fmt(s.b)}`,
              ROOMS[s.room].n,
              durTxt(s.dur),
              KINDS[s.kind as keyof typeof KINDS] || '',
              s.es ? 'Español' : '',
              s.track,
            ]
              .filter(Boolean)
              .join(' · ')}
            <article class={`item r-${s.room} fav`} data-card={s.id}>
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
                {#if s.tags.length}
                  <ul class="tp">
                    {#each s.tags as tag}
                      <li>{TOPICS[tag]}</li>
                    {/each}
                  </ul>
                {/if}
                {#if conflicts.length > 0}
                  <p class="warn">
                    <span class="pill">Se cruza</span>
                    con
                    {conflicts
                      .map((o) => `${o.title} (${ROOMS[o.room].n}, ${fmt(o.a)}–${fmt(o.b)})`)
                      .join('; ')}
                  </p>
                {/if}
              </div>
              <button
                type="button"
                class="star"
                data-fav={s.id}
                aria-pressed="true"
                aria-label="Quitar de mi agenda"
                title="Quitar de mi agenda"
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
