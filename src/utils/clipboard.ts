import { DAYS, ROOMS } from '../data/constants';
import type { Session } from '../types/session';
import { fmt } from './time';

/**
 * Genera el resumen en texto plano formateado de la agenda personal.
 */
export const formatAgendaText = (sessions: Session[]): string => {
  let text = 'Mi agenda · Ekoparty 2026';
  let currentDay = 0;

  sessions.forEach((s) => {
    if (s.day !== currentDay) {
      currentDay = s.day;
      text += `\n\n${DAYS[s.day].w} ${DAYS[s.day].d}`;
    }
    const speakerInfo = s.who.length ? ` (${s.who.join(', ')})` : '';
    text += `\n${fmt(s.a)}–${fmt(s.b)} · ${ROOMS[s.room].n} · ${s.title}${speakerInfo}`;
  });

  return text;
};

/**
 * Intenta copiar texto al portapapeles del navegador.
 */
export const copyTextToClipboard = async (text: string): Promise<boolean> => {
  if (typeof navigator === 'undefined' || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
};
