import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { Room } from '../types';
import { PLANNED_MINUTES } from '../data';
import { ROOM_TYPE_NAME, elapsedMs, formatClock, formatTime, statusPhrase } from '../format';
import { PRIORITY_LABEL, priorityOf } from '../priority';
import { IconChevron, IconSpark } from '../icons';
import { PriorityIcon } from './PriorityIcon';
import { RoomNotes } from './RoomNotes';

type Props = {
  room: Room;
  now: number;
  onBack: () => void;
  onEdit: (patch: Partial<Room>, label?: string) => void;
};

export function RoomDetail({ room, now, onBack, onEdit }: Props) {
  const [tab, setTab] = useState<'details' | 'activity'>('details');
  const backRef = useRef<HTMLButtonElement>(null);
  const typeName = ROOM_TYPE_NAME[room.roomType];
  const priority = priorityOf(room, now);
  const timed = room.status === 'in_progress' || room.status === 'clean';

  useEffect(() => {
    backRef.current?.focus();
  }, []);

  const rows: [string, ReactNode][] = [
    [
      'Priority',
      <span className="priority-cell">
        <PriorityIcon priority={priority} />
        {PRIORITY_LABEL[priority]}
      </span>,
    ],
    ['Guest arrives', room.arrivalAt ? formatTime(room.arrivalAt) : 'No arrival today'],
    ['Condition', room.heavy ? 'Heavy clean' : 'Standard'],
    ['Cleaned by', room.assignedToMe ? 'Maya Chen' : 'Unassigned'],
    ['Planned', `${PLANNED_MINUTES[room.service]} min`],
    ['Clean type', room.service],
    ['Room type', `${room.roomType} · ${typeName}`],
    ['Room status', `${room.occupancy} ${room.condition}`],
    ['Checkout', room.checkout ? 'Checkout today' : 'No checkout'],
  ];
  if (room.flagReason) rows.push(['Flagged', room.flagNote ? `${room.flagReason} · ${room.flagNote}` : room.flagReason]);
  if (room.finishedAt) rows.push(['Finished', formatTime(room.finishedAt)]);

  return (
    <div
      className="detail"
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      onKeyDown={(event) => event.key === 'Escape' && onBack()}
    >
      <div className="detail-top">
        <button ref={backRef} type="button" className="icon-btn back" aria-label="Back to My work" onClick={onBack}>
          <IconChevron />
        </button>
        <span className={`status-pill ${room.status}`}>{statusPhrase(room)}</span>
      </div>

      {timed && (
        <div className="detail-band">
          <span className="progress-label">
            <span className="dot" />
            {statusPhrase(room)}
          </span>
          <strong className="detail-clock">{formatClock(elapsedMs(room, now))}</strong>
        </div>
      )}

      <div className="detail-body">
        <p className="eyebrow">
          <IconSpark />
          Clean
        </p>
        <h2 id="detail-title">
          {room.number} <span>{room.service} · {typeName}</span>
        </h2>

        <div className="segmented">
          {(['details', 'activity'] as const).map((id) => (
            <button key={id} type="button" aria-pressed={tab === id} onClick={() => setTab(id)}>
              {id === 'details' ? 'Details' : 'Activity'}
            </button>
          ))}
        </div>

        {tab === 'details' ? (
          <>
            <dl className="detail-table">
              {rows.map(([label, value]) => (
                <div key={label}>
                  <dt>{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
            <RoomNotes room={room} onEdit={onEdit} />
          </>
        ) : room.history.length ? (
          <ol className="detail-table">
            {room.history.map((event) => (
              <li key={`${event.at}-${event.label}`}>
                <span>{event.label}</span>
                <time dateTime={new Date(event.at).toISOString()}>{formatTime(event.at)}</time>
              </li>
            ))}
          </ol>
        ) : (
          <p className="empty">No activity yet.</p>
        )}
      </div>
    </div>
  );
}
