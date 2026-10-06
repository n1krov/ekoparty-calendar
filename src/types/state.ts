import type { DayId, RoomId, SpecialTrackId, TopicId } from './session';

export type ViewMode = 'grid' | 'list' | 'agenda';

export type SelectedDay = DayId | 'all';

export interface FilterState {
  view: ViewMode;
  day: SelectedDay;
  rooms: Set<RoomId>;
  topics: Set<TopicId>;
  specialTrack: SpecialTrackId | null;
  es: boolean;
  q: string;
}

export interface SheetState {
  isOpen: boolean;
  sessionId: string | null;
  openerElement: HTMLElement | null;
}

export interface ToastState {
  message: string;
  isVisible: boolean;
}
