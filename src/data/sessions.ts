import type { Session } from '../types/session';
import { hm } from '../utils/time';
import { RAW } from './raw-sessions';

/**
 * Colección normalizada de sesiones de la Ekoparty 2026.
 */
export const sessions: Session[] = RAW.map((r) => {
  const [day, room, timeStr, duration, title, speakers, opts = {}] = r;
  const startTime = hm(timeStr);
  const id = `${day}-${room}-${timeStr.replace(':', '')}`;

  return {
    id,
    day,
    room,
    a: startTime,
    dur: duration,
    b: startTime + duration,
    title,
    who: speakers ? speakers.split('|') : [],
    kind: opts.k || '',
    es: Boolean(opts.es),
    track: opts.tr || '',
    tags: opts.tg || [],
    cut: title.includes('…'),
  };
});

/**
 * Diccionario de búsqueda directa por ID de sesión.
 */
export const byId: Record<string, Session> = sessions.reduce(
  (acc, s) => {
    acc[s.id] = s;
    return acc;
  },
  {} as Record<string, Session>
);
