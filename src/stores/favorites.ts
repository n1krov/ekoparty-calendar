import { byId, sessions } from '../data/sessions';
import type { Session } from '../types';
import { isOverlapping } from '../utils/overlap';
import { loadFavorites, saveFavorites } from '../utils/storage';
import { writable } from './store-utils';

const initialIds = loadFavorites().filter((id) => Boolean(byId[id]));
export const favorites = writable<Set<string>>(new Set(initialIds));

export function getSessionConflicts(session: Session, favs: Set<string>): Session[] {
  return sessions.filter((other) => favs.has(other.id) && isOverlapping(session, other));
}

export function toggleFavorite(id: string): { isAdded: boolean; hasConflict: boolean } {
  const targetSession = byId[id];
  if (!targetSession) {
    return { isAdded: false, hasConflict: false };
  }

  let isAdded = false;
  let hasConflict = false;

  favorites.update((set) => {
    const next = new Set(set);
    if (next.has(id)) {
      next.delete(id);
      isAdded = false;
    } else {
      next.add(id);
      isAdded = true;
      hasConflict = sessions.some(
        (other) => next.has(other.id) && isOverlapping(targetSession, other)
      );
    }
    saveFavorites(Array.from(next));
    return next;
  });

  return { isAdded, hasConflict };
}
