/**
 * Normaliza un texto para búsqueda: convierte a minúsculas y elimina marcas diacríticas/tildes.
 */
export const norm = (t: string): string => {
  return String(t)
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
};

/**
 * Escapa caracteres HTML especiales para renderizado seguro.
 */
export const esc = (t: string): string => {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };
  return String(t).replace(/[&<>"']/g, (c) => map[c] || c);
};
