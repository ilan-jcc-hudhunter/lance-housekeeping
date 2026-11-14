export type RoomStatus = 'not_started' | 'in_progress' | 'flagged' | 'clean';

export type ServiceType = 'Full service' | 'Refresh';

export type RoomEvent = { label: string; at: number };

export type Room = {
  id: string;
  number: string;
  service: ServiceType;
  occupancy: 'Vacant' | 'Occupied';
  condition: 'dirty' | 'clean';
  roomType: 'KING' | 'QNQN' | 'SUITE';
  checkout: boolean;
  assignedToMe: boolean;
  status: RoomStatus;
  startedAt: number | null;
  elapsedMs: number | null;
  finishedAt: number | null;
  flagReason: string | null;
  flagNote: string | null;
  order: number;
  history: RoomEvent[];
  /** When the next guest checks in; null when nobody is arriving today. */
  arrivalAt: number | null;
  /** Needs more than a standard clean (heavy soil, extra linens, etc.). */
  heavy: boolean;
  note: string;
  photos: string[];
};

export type Priority = 'high' | 'medium' | 'low';

export type FilterId = 'all' | 'mine' | 'checkout' | 'refresh' | Priority;

export type ToastTone = 'go' | 'done' | 'flag' | 'info';

export type Toast = {
  id: number;
  tone: ToastTone;
  text: string;
};
