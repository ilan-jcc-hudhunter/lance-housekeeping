import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent, PointerEvent as ReactPointerEvent } from 'react';
import type { Priority, Room } from '../types';
import { elapsedMs, formatClock, statusPhrase } from '../format';
import { IconCheck, IconFlag, IconPlay } from '../icons';
import { RoomSummary } from './RoomSummary';

const THRESHOLD = 88;

type Props = {
  room: Room;
  now: number;
  priority: Priority;
  onOpen: (id: string) => void;
  /** Number of the room currently being cleaned; starting this one is blocked until it's finished. */
  blockedBy: string | null;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onOpenFlag: (id: string) => void;
};

type Drag = { active: boolean; pointerId: number; x: number; y: number; axis: '' | 'x' | 'y' };

export function RoomCard({ room, now, priority, onOpen, blockedBy, onStart, onComplete, onOpenFlag }: Props) {
  const ref = useRef<HTMLLIElement>(null);
  const drag = useRef<Drag>({ active: false, pointerId: -1, x: 0, y: 0, axis: '' });
  const offsetRef = useRef(0);
  const [offset, setOffset] = useState(0);
  const [snapping, setSnapping] = useState(false);
  const [justChanged, setJustChanged] = useState(false);
  const prevStatus = useRef(room.status);
  const finishing = room.status === 'in_progress';

  const go = () => (finishing ? onComplete(room.id) : onStart(room.id));
  const flag = () => onOpenFlag(room.id);
  const latest = useRef({ go, flag });
  latest.current = { go, flag };

  function moveTo(next: number, snap: boolean) {
    offsetRef.current = next;
    setOffset(next);
    setSnapping(snap);
  }

  useEffect(() => {
    if (prevStatus.current === room.status) return;
    prevStatus.current = room.status;
    setJustChanged(true);
    const timeout = window.setTimeout(() => setJustChanged(false), 700);
    return () => window.clearTimeout(timeout);
  }, [room.status]);

  useEffect(() => {
    function onMove(event: PointerEvent) {
      const state = drag.current;
      if (!state.active || event.pointerId !== state.pointerId) return;
      const dx = event.clientX - state.x;
      const dy = event.clientY - state.y;
      if (!state.axis) {
        if (Math.abs(dx) < 10 && Math.abs(dy) < 10) return;
        state.axis = Math.abs(dx) > Math.abs(dy) ? 'x' : 'y';
        if (state.axis === 'y') {
          state.active = false;
          return;
        }
      }
      const max = Math.min((ref.current?.clientWidth ?? 320) * 0.78, 250);
      const next = Math.round(Math.sign(dx) * Math.min(Math.abs(dx), max));
      if (Math.abs(next) >= THRESHOLD && Math.abs(offsetRef.current) < THRESHOLD) navigator.vibrate?.(10);
      moveTo(next, false);
    }

    function onUp(event: PointerEvent) {
      const state = drag.current;
      if (!state.active || event.pointerId !== state.pointerId) return;
      state.active = false;
      const dx = offsetRef.current;
      moveTo(0, true);
      if (Math.abs(dx) < THRESHOLD) return;
      if (dx < 0) latest.current.go();
      else latest.current.flag();
    }

    function onBlur() {
      if (!drag.current.active) return;
      drag.current.active = false;
      moveTo(0, true);
    }

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  function onPointerDown(event: ReactPointerEvent) {
    if (event.button !== 0) return;
    drag.current = { active: true, pointerId: event.pointerId, x: event.clientX, y: event.clientY, axis: '' };
  }

  function onKeyDown(event: ReactKeyboardEvent) {
    if (event.target !== event.currentTarget) return;
    if (event.key === 'ArrowLeft') go();
    else if (event.key === 'ArrowRight') flag();
    else if (event.key === 'Enter') onOpen(room.id);
    else return;
    event.preventDefault();
  }

  const elapsed = elapsedMs(room, now);
  const armedLeft = offset <= -THRESHOLD;
  const armedRight = offset >= THRESHOLD;
  const iconScale = `scale(${0.86 + Math.min(Math.abs(offset) / THRESHOLD, 1) * 0.22})`;
  const goVerb = finishing ? 'finish' : 'start';

  return (
    <li
      ref={ref}
      className={`swipe ${snapping ? 'snap' : ''}`}
      data-room={room.number}
      data-status={room.status}
      tabIndex={0}
      onPointerDown={onPointerDown}
      onKeyDown={onKeyDown}
      onClick={() => !drag.current.axis && onOpen(room.id)}
    >
      {offset > 0 && (
        <div className={`rail stop ${armedRight ? 'armed' : ''}`} aria-hidden="true">
          <span className="rail-icon" style={{ transform: iconScale }}>
            <IconFlag />
          </span>
          <span>{armedRight ? 'Release to flag' : "Can't clean"}</span>
        </div>
      )}
      {offset < 0 && (
        <div className={`rail go ${armedLeft ? 'armed' : ''} ${blockedBy ? 'blocked' : ''}`} aria-hidden="true">
          <span>
            {blockedBy ? `Finish ${blockedBy} first` : armedLeft ? `Release to ${goVerb}` : finishing ? 'Finish' : 'Start'}
          </span>
          <span className="rail-icon" style={{ transform: iconScale }}>
            {finishing ? <IconCheck /> : <IconPlay />}
          </span>
        </div>
      )}
      <div
        className={`face ${room.status} ${justChanged ? 'just-changed' : ''}`}
        style={{ transform: `translate3d(${offset}px, 0, 0)` }}
      >
        <RoomSummary
          room={room}
          priority={priority}
          aside={
            finishing && (
              <time className="timer" dateTime={`PT${Math.floor(elapsed / 1000)}S`} data-timer="true">
                {formatClock(elapsed)}
              </time>
            )
          }
        >
          {!room.assignedToMe && <span className="flag-note">Unassigned</span>}
          {finishing && (
            <span className="status-line progress-label">
              <span className="dot" />
              In progress
            </span>
          )}
          {room.status === 'flagged' && (
            <span className="status-line">
              <span className="flag-line">
                <IconFlag />
                {room.flagReason}
              </span>
              {room.flagNote && <span className="flag-note">{room.flagNote}</span>}
              {room.elapsedMs ? <span className="flag-note">Paused at {formatClock(room.elapsedMs)}</span> : null}
            </span>
          )}
        </RoomSummary>
        <span className="sr-only">
          Room {room.number}. {statusPhrase(room)}. Tap or press Enter for details. Swipe left or press the left arrow to{' '}
          {goVerb}. Swipe right or press the right arrow if you cannot clean.
        </span>
      </div>
    </li>
  );
}
