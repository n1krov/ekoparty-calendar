export type RoomId = 'M' | 'D' | 'C1' | 'C2' | 'C3';

export type DayId = 7 | 8 | 9;

export type TopicId = 'ia' | 'exp' | 'hw' | 'def' | 'id' | 'fin' | 'cti' | 'soc';

export type KindId = 's' | 'l' | 'w' | 'c';

export type SpecialTrackId = 'linux_lowlevel' | 'redteam_exploit' | 'devsecops_cloud';

export interface RoomInfo {
  n: string; // Nombre completo (ej: 'Maintrack')
  c: string; // Código corto (ej: 'M')
}

export interface DayInfo {
  w: string; // Día semana largo (ej: 'Miércoles')
  s: string; // Día semana corto (ej: 'Mié')
  d: string; // Fecha completa (ej: '7 de octubre')
}

export interface RawOptions {
  k?: KindId;
  es?: number | boolean;
  tr?: string;
  tg?: TopicId[];
}

export type RawSessionTuple = [
  day: DayId,
  room: RoomId,
  time: string,
  duration: number,
  title: string,
  speakers: string,
  options?: RawOptions
];

export interface Session {
  id: string;
  day: DayId;
  room: RoomId;
  a: number; // Hora inicio en minutos desde medianoche
  dur: number; // Duración en minutos
  b: number; // Hora fin en minutos (a + dur)
  title: string;
  who: string[];
  kind: KindId | '';
  es: boolean;
  track: string;
  tags: TopicId[];
  cut: boolean;
}
