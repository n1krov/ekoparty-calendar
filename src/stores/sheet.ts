import type { SheetState } from '../types';
import { writable } from './store-utils';

const initialState: SheetState = {
  isOpen: false,
  sessionId: null,
  openerElement: null,
};

export const sheetState = writable<SheetState>(initialState);

export function openSheet(id: string, opener?: HTMLElement | null): void {
  sheetState.set({
    isOpen: true,
    sessionId: id,
    openerElement: opener || (typeof document !== 'undefined' ? (document.activeElement as HTMLElement) : null),
  });
}

export function closeSheet(): void {
  sheetState.update((state) => {
    if (state.openerElement && typeof document !== 'undefined' && document.contains(state.openerElement)) {
      state.openerElement.focus();
    }
    return {
      isOpen: false,
      sessionId: null,
      openerElement: null,
    };
  });
}
