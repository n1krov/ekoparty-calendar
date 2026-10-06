/**
 * Convierte un string de hora formato "HH:MM" a minutos transcurridos desde las 00:00.
 */
export const hm = (t: string): number => {
  const [hh, mm] = t.split(':');
  return Number(hh) * 60 + Number(mm);
};

/**
 * Formatea minutos a formato "HH:MM" con padding de 2 ceros.
 */
export const fmt = (m: number): string => {
  const hours = Math.floor(m / 60);
  const minutes = m % 60;
  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Devuelve la representación legible de duración ("45 min" o "2 h").
 */
export const durTxt = (m: number): string => {
  return m >= 120 ? `${m / 60} h` : `${m} min`;
};

/**
 * Devuelve el texto pluralizado para sesiones ("1 sesión" o "N sesiones").
 */
export const plural = (n: number): string => {
  return `${n} ${n === 1 ? 'sesión' : 'sesiones'}`;
};
