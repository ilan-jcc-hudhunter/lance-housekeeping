import { useEffect, useRef, useState } from 'react';
import type { Room, Toast } from './types';
import { createRooms } from './data';
import { FlagSheet } from './components/FlagSheet';
import { MyWork } from './components/MyWork';
import { RoomDetail } from './components/RoomDetail';
import { ToastView } from './components/ToastView';
import { IconBell, IconList, IconMessage, IconPlus } from './icons';

const LOCK_MS = 450;

export function App() {
  const [rooms, setRooms] = useState<Room[]>(() => createRooms());
  const [now, setNow] = useState(() => Date.now());
  const [tab, setTab] = useState<'work' | 'messages'>('work');
  const [toast, setToast] = useState<Toast | null>(null);
  const [flagId, setFlagId] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [justFinished, setJustFinished] = useState<string | null>(null);
  const roomsRef = useRef(rooms);
  const locks = useRef(new Set<string>());
  const returnFocus = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 500);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1500);
    return () => window.clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (!justFinished) return;
    const id = window.setTimeout(() => setJustFinished(null), 1600);
    return () => window.clearTimeout(id);
  }, [justFinished]);

  const find = (id: string | null) => roomsRef.current.find((room) => room.id === id);

  function notify(tone: Toast['tone'], text: string) {
    setToast({ id: Date.now(), tone, text });
  }

  function editRoom(id: string, patch: Partial<Room>, label?: string) {
    const at = Date.now();
    const next = roomsRef.current.map((room) =>
      room.id === id
        ? { ...room, ...patch, history: label ? [{ label, at }, ...room.history] : room.history }
        : room,
    );
    roomsRef.current = next;
    setRooms(next);
    return next;
  }

  /** Applies one status change per room at a time, so a double swipe or tap can't submit twice. */
  function update(id: string, label: string, patch: (room: Room) => Partial<Room>) {
    const room = find(id);
    if (!room || locks.current.has(id)) return null;
    locks.current.add(id);
    window.setTimeout(() => locks.current.delete(id), LOCK_MS);
    return editRoom(id, patch(room), label);
  }

  function startRoom(id: string) {
    const room = find(id);
    if (!room || room.status === 'clean' || room.status === 'in_progress') return;
    const current = roomsRef.current.find((r) => r.status === 'in_progress');
    if (current) {
      notify('info', `Finish ${current.number} first`);
      return;
    }
    const updated = update(id, room.elapsedMs ? 'Resumed cleaning' : 'Started cleaning', (r) => ({
      status: 'in_progress',
      startedAt: Date.now() - (r.elapsedMs ?? 0),
      flagReason: null,
      flagNote: null,
    }));
    if (updated) notify('go', `${room.number} started`);
  }

  function completeRoom(id: string) {
    const room = find(id);
    if (!room || room.status !== 'in_progress') return;
    const updated = update(id, 'Completed clean', (r) => ({
      status: 'clean',
      condition: 'clean',
      elapsedMs: Date.now() - (r.startedAt ?? Date.now()),
      startedAt: null,
      finishedAt: Date.now(),
    }));
    if (!updated) return;
    setJustFinished(id);
    notify('done', `${room.number} done`);
  }

  function confirmFlag(reason: string, note: string) {
    const room = find(flagId);
    if (!room || room.status === 'clean') return;
    const trimmed = note.trim() || null;
    const updated = update(room.id, `Flagged · ${reason}`, (r) => ({
      status: 'flagged',
      flagReason: reason,
      flagNote: trimmed,
      startedAt: null,
      elapsedMs: r.status === 'in_progress' && r.startedAt ? Date.now() - r.startedAt : r.elapsedMs,
    }));
    if (!updated) return;
    setFlagId(null);
    notify('flag', `${room.number} flagged`);
  }

  function resetRooms() {
    const next = roomsRef.current.map((room): Room => ({
      ...room,
      status: 'not_started',
      condition: 'dirty',
      startedAt: null,
      elapsedMs: null,
      finishedAt: null,
      flagReason: null,
      flagNote: null,
      history: [],
    }));
    roomsRef.current = next;
    setRooms(next);
    setJustFinished(null);
    notify('info', 'All rooms reset');
  }

  function openOverlay(open: () => void) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    open();
  }

  function closeOverlay(close: () => void) {
    close();
    window.requestAnimationFrame(() => returnFocus.current?.focus());
  }

  const flagRoom = find(flagId);
  const detailRoom = find(detailId);
  const overlay = Boolean(flagRoom || detailRoom);

  return (
    <div className="app">
      <div className="shell" {...(overlay ? { inert: true } : {})}>
        <header className="top">
          <div className="header">
            <div className="avatar" role="img" aria-label="Maya Chen">
              MC
            </div>
            <h1>{tab === 'work' ? 'My work' : 'Messages'}</h1>
            <div className="header-actions">
              <button type="button" className="icon-btn" aria-label="Alerts" onClick={() => notify('info', 'No new alerts')}>
                <IconBell />
              </button>
              <button
                type="button"
                className="icon-btn solid"
                aria-label="Add"
                onClick={() => notify('info', 'Rooms are assigned by the desk')}
              >
                <IconPlus />
              </button>
            </div>
          </div>
        </header>

        {tab === 'work' ? (
          <MyWork
            rooms={rooms}
            now={now}
            justFinished={justFinished}
            onStart={startRoom}
            onComplete={completeRoom}
            onReset={resetRooms}
            onOpenFlag={(id) => find(id)?.status !== 'clean' && openOverlay(() => setFlagId(id))}
            onOpenRoom={(id) => openOverlay(() => setDetailId(id))}
          />
        ) : (
          <main className="main">
            <p className="empty">Nothing new from the desk.</p>
          </main>
        )}

        <nav className="tabbar" aria-label="Primary">
          <button type="button" className="tab" aria-current={tab === 'messages' ? 'page' : undefined} onClick={() => setTab('messages')}>
            <IconMessage />
            Messages
          </button>
          <button type="button" className="tab" aria-current={tab === 'work' ? 'page' : undefined} onClick={() => setTab('work')}>
            <IconList />
            My work
          </button>
        </nav>
      </div>

      {toast && !detailRoom && <ToastView toast={toast} />}
      {detailRoom && (
        <RoomDetail
          room={detailRoom}
          now={now}
          onBack={() => closeOverlay(() => setDetailId(null))}
          onEdit={(patch, label) => editRoom(detailRoom.id, patch, label)}
        />
      )}
      {flagRoom && (
        <FlagSheet room={flagRoom} onClose={() => closeOverlay(() => setFlagId(null))} onConfirm={confirmFlag} />
      )}
    </div>
  );
}
