import type { Room } from './types';

export const PLANNED_MINUTES: Record<Room['service'], number> = { 'Full service': 30, Refresh: 20 };

const HOUR = 3_600_000;

function room(
  number: string,
  service: Room['service'],
  occupancy: Room['occupancy'],
  roomType: Room['roomType'],
  order: number,
  extra: Partial<Room> = {},
): Room {
  return {
    id: number,
    number,
    service,
    occupancy,
    roomType,
    order,
    condition: 'dirty',
    checkout: false,
    assignedToMe: true,
    status: 'not_started',
    startedAt: null,
    elapsedMs: null,
    finishedAt: null,
    flagReason: null,
    flagNote: null,
    history: [],
    arrivalAt: null,
    heavy: false,
    note: '',
    photos: [],
    ...extra,
  };
}

function flagged(at: number, flagReason: string, flagNote: string | null = null): Partial<Room> {
  return { status: 'flagged', flagReason, flagNote, history: [{ label: `Flagged · ${flagReason}`, at }] };
}

function done(finishedAt: number, minutes: number): Partial<Room> {
  const elapsedMs = minutes * 60_000;
  return {
    status: 'clean',
    condition: 'clean',
    finishedAt,
    elapsedMs,
    history: [
      { label: 'Completed clean', at: finishedAt },
      { label: 'Started cleaning', at: finishedAt - elapsedMs },
    ],
  };
}

export function createRooms(now = Date.now()): Room[] {
  const started = now - 252_000;
  const ago = (minutes: number) => now - minutes * 60_000;
  return [
    room('102', 'Refresh', 'Occupied', 'KING', 1, {
      status: 'in_progress',
      startedAt: started,
      history: [{ label: 'Started cleaning', at: started }],
    }),
    room('103', 'Full service', 'Vacant', 'KING', 2, { arrivalAt: now + 1.5 * HOUR }),
    room('104', 'Refresh', 'Occupied', 'QNQN', 3, { heavy: true }),
    room('105', 'Refresh', 'Occupied', 'KING', 4),
    room('106', 'Full service', 'Vacant', 'SUITE', 5, { checkout: true, heavy: true, arrivalAt: now + 3 * HOUR }),
    room('107', 'Full service', 'Vacant', 'QNQN', 6, { checkout: true, arrivalAt: now + 45 * 60_000 }),
    room('108', 'Full service', 'Occupied', 'QNQN', 7, flagged(ago(25), 'Do Not Disturb')),
    room('109', 'Refresh', 'Occupied', 'KING', 8, flagged(ago(12), 'Guest Present')),
    room('110', 'Refresh', 'Vacant', 'KING', 9, {
      arrivalAt: now + 2.5 * HOUR,
      ...flagged(ago(40), 'Maintenance Issue', 'AC not cooling'),
    }),
    room('112', 'Full service', 'Vacant', 'SUITE', 10, {
      checkout: true,
      heavy: true,
      ...flagged(ago(55), 'Maintenance Issue', 'Shower drain clogged'),
    }),
    room('114', 'Refresh', 'Occupied', 'QNQN', 11, flagged(ago(8), 'Other', 'Pet in room, waiting on guest')),
    room('115', 'Full service', 'Vacant', 'KING', 12, { checkout: true, arrivalAt: now + 6 * HOUR }),
    room('101', 'Full service', 'Vacant', 'KING', 13, { checkout: true, ...done(ago(20), 28) }),
    room('111', 'Refresh', 'Occupied', 'QNQN', 14, done(ago(65), 17)),
    room('113', 'Full service', 'Vacant', 'SUITE', 15, { checkout: true, heavy: true, ...done(ago(110), 46) }),
    room('207', 'Refresh', 'Vacant', 'KING', 16, { assignedToMe: false, arrivalAt: now + 5 * HOUR }),
    room('209', 'Full service', 'Vacant', 'QNQN', 17, { assignedToMe: false, checkout: true, heavy: true }),
    room('211', 'Refresh', 'Occupied', 'KING', 18, { assignedToMe: false, ...flagged(ago(30), 'Do Not Disturb') }),
  ];
}

export const FLAG_REASONS = [
  { id: 'dnd', label: 'Do Not Disturb', detail: 'The door is signed' },
  { id: 'guest', label: 'Guest Present', detail: 'Someone is in the room' },
  { id: 'maintenance', label: 'Maintenance Issue', detail: 'Needs a fix before the clean' },
  { id: 'other', label: 'Other', detail: 'Add a short note' },
] as const;
