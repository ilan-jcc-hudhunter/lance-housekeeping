import type { ReactNode } from 'react';
import type { Priority, Room } from '../types';
import { roomLine } from '../format';
import { IconSpark } from '../icons';
import { PriorityIcon } from './PriorityIcon';

type Props = {
  room: Room;
  priority?: Priority;
  aside?: ReactNode;
  children?: ReactNode;
};

export function RoomSummary({ room, priority, aside, children }: Props) {
  return (
    <>
      <span className="number-row">
        <span className="room-id">
          <span className="room-number">{room.number}</span>
          {priority && <PriorityIcon priority={priority} />}
        </span>
        {aside}
      </span>
      <span className="service">{room.service}</span>
      <span className="meta">
        <IconSpark />
        <span>{roomLine(room)}</span>
      </span>
      {children}
    </>
  );
}
