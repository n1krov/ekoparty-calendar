import type { ToastState } from '../types';
import { writable } from './store-utils';

const initialState: ToastState = {
  message: '',
  isVisible: false,
};

let toastTimeout: ReturnType<typeof setTimeout> | undefined;

export const toastState = writable<ToastState>(initialState);

export function showToast(message: string, durationMs = 2400): void {
  if (toastTimeout) {
    clearTimeout(toastTimeout);
  }

  toastState.set({
    message,
    isVisible: true,
  });

  if (typeof window !== 'undefined') {
    toastTimeout = setTimeout(() => {
      toastState.set({
        message: '',
        isVisible: false,
      });
    }, durationMs);
  }
}
