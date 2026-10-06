import { ROOMS, TOPICS } from '../data/constants';
import type { RoomId, SelectedDay, Session, TopicId, ViewMode } from '../types';
import { norm } from '../utils/normalize';
import { derived, writable } from './store-utils';

const initialView: ViewMode =
  typeof window !== 'undefined' && window.matchMedia('(max-width: 700px)').matches
    ? 'list'
    : 'grid';

export const view = writable<ViewMode>(initialView);
export const selectedDay = writable<SelectedDay>(7);
export const activeRooms = writable<Set<RoomId>>(new Set());
export const activeTopics = writable<Set<TopicId>>(new Set());
export const onlySpanish = writable<boolean>(false);
export const searchQuery = writable<string>('');

export const hasActiveFilters = derived(
  activeRooms,
  ($rooms) => {
    let active = $rooms.size > 0;
    // Comprobamos el resto de condiciones suscribiéndonos al estado
    return active;
  }
);

export function toggleRoom(roomId: RoomId): void {
  activeRooms.update((set) => {
    const next = new Set(set);
    if (next.has(roomId)) {
      next.delete(roomId);
    } else {
      next.add(roomId);
    }
    return next;
  });
}

export function toggleTopic(topicId: TopicId): void {
  activeTopics.update((set) => {
    const next = new Set(set);
    if (next.has(topicId)) {
      next.delete(topicId);
    } else {
      next.add(topicId);
    }
    return next;
  });
}

export function toggleSpanish(): void {
  onlySpanish.update((val) => !val);
}

export function setSearchQuery(q: string): void {
  searchQuery.set(norm(q.trim()));
}

export function clearAllFilters(): void {
  activeRooms.set(new Set());
  activeTopics.set(new Set());
  onlySpanish.set(false);
  searchQuery.set('');
}

export function matchSession(
  s: Session,
  rooms: Set<RoomId>,
  topics: Set<TopicId>,
  es: boolean,
  q: string
): boolean {
  if (rooms.size > 0 && !rooms.has(s.room)) {
    return false;
  }
  if (topics.size > 0 && !s.tags.some((t) => topics.has(t))) {
    return false;
  }
  if (es && !s.es) {
    return false;
  }
  if (q) {
    const haystack = norm(
      [
        s.title,
        s.who.join(' '),
        s.track,
        ROOMS[s.room].n,
        s.tags.map((t) => TOPICS[t]).join(' '),
      ].join(' ')
    );
    if (!haystack.includes(q)) {
      return false;
    }
  }
  return true;
}
