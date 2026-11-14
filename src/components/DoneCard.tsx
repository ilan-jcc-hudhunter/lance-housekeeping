import type { Room } from '../types';
import { formatStopped } from '../format';
import { IconCheck } from '../icons';
import { RoomSummary } from './RoomSummary';

type Props = {
  room: Room;
  highlight: boolean;
  onOpen: (id: string) => void;
};

export function DoneCard({ room, highlight, onOpen }: Props) {
  return (
    <li data-room={room.number} data-status={room.status}>
      <button
        type="button"
        className={`face clean done-card ${highlight ? 'flash' : ''}`}
        aria-label={`Room ${room.number}, completed. View details`}
        onClick={() => onOpen(room.id)}
      >
        <RoomSummary
          room={room}
          aside={
            <span className="done-side">
              <span className="done-mark">
                <IconCheck />
                Completed
              </span>
              <span className="done-time">{formatStopped(room.elapsedMs ?? 0)}</span>
            </span>
          }
        />
      </button>
    </li>
  );
}
