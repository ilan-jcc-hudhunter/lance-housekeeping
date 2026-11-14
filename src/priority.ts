import type { Priority, Room } from './types';

const HOUR = 3_600_000;

export const PRIORITY_LABEL: Record<Priority, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export const PRIORITY_RANK: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

/** Sooner check-ins and heavier cleans come first. */
export function priorityOf(room: Room, now: number): Priority {
  const hoursToArrival = room.arrivalAt === null ? Infinity : (room.arrivalAt - now) / HOUR;
  if (hoursToArrival <= 2 || (hoursToArrival <= 4 && room.heavy)) return 'high';
  if (hoursToArrival <= 4 || room.heavy) return 'medium';
  return 'low';
}
