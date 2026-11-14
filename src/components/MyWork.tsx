import { Fragment, useEffect, useState } from 'react';
import type { FilterId, Priority, Room, RoomStatus } from '../types';
import { PRIORITY_LABEL, PRIORITY_RANK, priorityOf } from '../priority';
import { IconChevron, IconClose, IconSearch } from '../icons';
import { DoneCard } from './DoneCard';
import { PriorityIcon } from './PriorityIcon';
import { RoomCard } from './RoomCard';

type Filter = { id: FilterId; label: string; test: (room: Room, priority: Priority) => boolean; divider?: boolean };

const FILTERS: Filter[] = [
  ...(['high', 'medium', 'low'] as const).map((p) => ({
    id: p,
    label: PRIORITY_LABEL[p],
    test: (_: Room, priority: Priority) => priority === p,
  })),
  { id: 'checkout', label: 'Checkout', test: (room) => room.checkout, divider: true },
  { id: 'refresh', label: 'Refresh', test: (room) => room.service === 'Refresh' },
];

const HINT_SEEN = 'lance.swipeHintSeen';

/** The room being cleaned stays on top; everything else follows priority. */
const STATUS_RANK: Record<RoomStatus, number> = { in_progress: 0, not_started: 1, flagged: 1, clean: 2 };

type Props = {
  rooms: Room[];
  now: number;
  justFinished: string | null;
  onStart: (id: string) => void;
  onComplete: (id: string) => void;
  onOpenFlag: (id: string) => void;
  onOpenRoom: (id: string) => void;
  onReset: () => void;
};

function matchesQuery(room: Room, query: string) {
  const hay = [room.number, room.service, room.occupancy, room.condition, room.roomType, room.flagReason, room.flagNote]
    .join(' ')
    .toLowerCase();
  return hay.includes(query);
}

export function MyWork({ rooms, now, justFinished, onStart, onComplete, onOpenFlag, onOpenRoom, onReset }: Props) {
  const [filter, setFilter] = useState<FilterId>('all');
  const [query, setQuery] = useState('');
  const [showHint, setShowHint] = useState(() => !localStorage.getItem(HINT_SEEN));
  const [doneOpen, setDoneOpen] = useState(false);

  useEffect(() => localStorage.setItem(HINT_SEEN, '1'), []);

  useEffect(() => {
    if (justFinished) setDoneOpen(true);
  }, [justFinished]);

  const q = query.trim().toLowerCase();
  const priority = new Map(rooms.map((room) => [room.id, priorityOf(room, now)]));
  const rank = (room: Room) => PRIORITY_RANK[priority.get(room.id)!];
  const active = rooms
    .filter((room) => room.status !== 'clean')
    .sort((a, b) => STATUS_RANK[a.status] - STATUS_RANK[b.status] || rank(a) - rank(b) || a.order - b.order);
  const done = rooms
    .filter((room) => room.status === 'clean')
    .sort((a, b) => (b.finishedAt ?? 0) - (a.finishedAt ?? 0));
  const cleaning = active.find((room) => room.status === 'in_progress')?.number ?? null;
  const matches = (item: Filter) => (room: Room) => item.test(room, priority.get(room.id)!);
  const current = FILTERS.find((item) => item.id === filter);
  const visible = (list: Room[]) => list.filter((room) => (!current || matches(current)(room)) && matchesQuery(room, q));
  const visibleActive = visible(active);
  const visibleDone = visible(done);

  return (
    <main className="main">
      <div className="sticky-tools">
        <div className="filters" role="toolbar" aria-label="Filter rooms">
          {FILTERS.map((item) => (
            <Fragment key={item.id}>
              {item.divider && <span className="chip-divider" aria-hidden="true" />}
              <button
                type="button"
                className="chip"
                data-filter={item.id}
                aria-pressed={filter === item.id}
                onClick={() => setFilter((id) => (id === item.id ? 'all' : item.id))}
              >
                {item.id in PRIORITY_RANK && <PriorityIcon priority={item.id as Priority} />}
                {item.label}
                <span className="chip-count">{active.filter(matches(item)).length}</span>
              </button>
            </Fragment>
          ))}
        </div>
        <label className="search">
          <IconSearch />
          <input
            type="text"
            inputMode="search"
            enterKeyHint="search"
            placeholder="Search room or issue"
            aria-label="Search room or issue"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key !== 'Enter' || q !== 'reset') return;
              onReset();
              setQuery('');
              setFilter('all');
              event.currentTarget.blur();
            }}
          />
          {query && (
            <button type="button" className="clear-search" aria-label="Clear search" onClick={() => setQuery('')}>
              <IconClose />
            </button>
          )}
        </label>
      </div>

      {showHint && (
        <div className="hint" id="swipe-hint">
          <p>Swipe left to start or finish. Swipe right if you can't clean.</p>
          <button type="button" onClick={() => setShowHint(false)} aria-label="Dismiss tip">
            <IconClose />
          </button>
        </div>
      )}

      {visibleActive.length + visibleDone.length === 0 && (q || filter !== 'all') && (
        <p className="empty" role="status">
          {q ? `No rooms match “${query.trim()}”.` : 'No rooms in this view.'}
        </p>
      )}

      {visibleActive.length > 0 && (
        <section className="section" aria-label="Your rooms">
          <ul className="rooms" aria-describedby={showHint ? 'swipe-hint' : undefined}>
            {visibleActive.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                now={now}
                priority={priority.get(room.id)!}
                onOpen={onOpenRoom}
                blockedBy={room.status !== 'in_progress' ? cleaning : null}
                onStart={onStart}
                onComplete={onComplete}
                onOpenFlag={onOpenFlag}
              />
            ))}
          </ul>
        </section>
      )}

      {visibleDone.length > 0 && (
        <section className="section" aria-labelledby="done-heading">
          <button
            type="button"
            className="section-toggle"
            id="done-heading"
            aria-expanded={doneOpen}
            aria-controls="done-list"
            onClick={() => setDoneOpen((open) => !open)}
          >
            <span>Done today</span>
            <span className="badge">{visibleDone.length}</span>
            <IconChevron className="chevron" />
          </button>
          {doneOpen && (
            <ul className="rooms" id="done-list">
              {visibleDone.map((room) => (
                <DoneCard key={room.id} room={room} highlight={room.id === justFinished} onOpen={onOpenRoom} />
              ))}
            </ul>
          )}
        </section>
      )}
    </main>
  );
}
