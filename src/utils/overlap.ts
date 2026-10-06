import { ROOM_ORDER } from '../data/constants';
import type { Session } from '../types/session';

/**
 * Determina si dos sesiones se solapan en horario durante el mismo día.
 */
export const isOverlapping = (x: Session, y: Session): boolean => {
  return x.id !== y.id && x.day === y.day && x.a < y.b && y.a < x.b;
};

/**
 * Ordena sesiones cronológicamente: primero por día, luego por hora de inicio,
 * y finalmente por orden canónico de salas.
 */
export const compareSessions = (x: Session, y: Session): number => {
  return (
    x.day - y.day ||
    x.a - y.a ||
    ROOM_ORDER.indexOf(x.room) - ROOM_ORDER.indexOf(y.room)
  );
};
