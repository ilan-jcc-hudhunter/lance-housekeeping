import type { Room } from './types';

export const ROOM_TYPE_NAME: Record<Room['roomType'], string> = {
  KING: 'king bed',
  QNQN: 'two queens',
  SUITE: 'suite',
};

export function formatClock(ms: number) {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
}

export function formatStopped(ms: number) {
  if (ms < 10 * 60_000) return formatClock(ms);
  return `${Math.round(ms / 60_000)} min`;
}

export function formatTime(at: number) {
  return new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

export function roomLine(room: Room) {
  return `Clean ${room.occupancy} ${room.condition} · ${room.roomType}`;
}

export function statusPhrase(room: Room) {
  if (room.status === 'in_progress') return 'In progress';
  if (room.status === 'flagged') return room.flagReason ?? 'Flagged';
  if (room.status === 'clean') return 'Completed';
  return 'Not started';
}

export function elapsedMs(room: Room, now: number) {
  if (room.status === 'in_progress' && room.startedAt) return Math.max(0, now - room.startedAt);
  return room.elapsedMs ?? 0;
}
