import { STORAGE_KEY } from '../data/constants';

/**
 * Carga los IDs favoritos desde localStorage de manera segura.
 */
export const loadFavorites = (): string[] => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (err) {
    console.error('Error al leer favoritos desde localStorage:', err);
    return [];
  }
};

/**
 * Guarda los IDs favoritos en localStorage.
 */
export const saveFavorites = (ids: string[]): void => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch (err) {
    console.error('Error al guardar favoritos en localStorage:', err);
  }
};
