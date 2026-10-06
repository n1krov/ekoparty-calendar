import type { DayId, DayInfo, KindId, RoomId, RoomInfo, TopicId } from '../types/session';

export const ROOMS: Record<RoomId, RoomInfo> = {
  M: { n: 'Maintrack', c: 'M' },
  D: { n: 'Sala D', c: 'D' },
  C1: { n: 'Sala C1', c: 'C1' },
  C2: { n: 'Sala C2', c: 'C2' },
  C3: { n: 'Sala C3', c: 'C3' },
};

export const ROOM_ORDER: RoomId[] = ['M', 'D', 'C1', 'C2', 'C3'];

export const TOPICS: Record<TopicId, string> = {
  ia: 'IA y agentes',
  exp: 'Explotación y ofensiva',
  hw: 'Hardware y reversing',
  def: 'Defensa y cloud',
  id: 'Identidad y privacidad',
  fin: 'Fraude y finanzas',
  cti: 'Cibercrimen e inteligencia',
  soc: 'Sociedad y comunidad',
};

export const DAYS: Record<DayId, DayInfo> = {
  7: { w: 'Miércoles', s: 'Mié', d: '7 de octubre' },
  8: { w: 'Jueves', s: 'Jue', d: '8 de octubre' },
  9: { w: 'Viernes', s: 'Vie', d: '9 de octubre' },
};

export const KINDS: Record<KindId, string> = {
  s: 'Charla',
  l: 'Lightning talk',
  w: 'Apertura',
  c: 'CTF',
};

export const SITE = 'https://ekoparty.org/agenda-2026/';
export const STORAGE_KEY = 'ekoparty2026-agenda';

// Constantes de escala física para la grilla horaria
export const PX = 3.4;
export const OFF = 14;
