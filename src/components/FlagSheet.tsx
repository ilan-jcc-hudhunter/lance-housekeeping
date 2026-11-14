import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import type { Room } from '../types';
import { FLAG_REASONS } from '../data';
import { IconClose } from '../icons';

type Props = {
  room: Room;
  onClose: () => void;
  onConfirm: (reason: string, note: string) => void;
};

export function FlagSheet({ room, onClose, onConfirm }: Props) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const noteRef = useRef<HTMLTextAreaElement>(null);
  const sheetRef = useRef<HTMLDivElement>(null);
  const [other, setOther] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  useEffect(() => {
    if (other) noteRef.current?.focus();
  }, [other]);

  function onKeyDown(event: ReactKeyboardEvent<HTMLDivElement>) {
    if (event.key === 'Escape') {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key !== 'Tab') return;
    const root = sheetRef.current;
    if (!root) return;
    const items = [...root.querySelectorAll<HTMLElement>('button, textarea, input')].filter(
      (item) => !item.hasAttribute('disabled'),
    );
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  return (
    <div className="sheet-root">
      <button type="button" className="backdrop" aria-label="Dismiss" onClick={onClose} />
      <div
        ref={sheetRef}
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby="flag-title"
        data-sheet="flag"
        onKeyDown={onKeyDown}
      >
        <div className="grabber" aria-hidden="true" />
        <div className="sheet-head">
          <div>
            <h2 id="flag-title" tabIndex={-1} ref={titleRef}>
              Can't clean {room.number}
            </h2>
            <p>{room.status === 'flagged' ? 'Update the reason. It stays on your board.' : 'It stays on your board.'}</p>
            {room.status === 'in_progress' && <p>Flagging pauses the timer.</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <div className="reasons">
          {FLAG_REASONS.map((reason) => (
            <button
              key={reason.id}
              type="button"
              className={`reason-btn ${other && reason.id === 'other' ? 'selected' : ''}`}
              data-reason={reason.label}
              onClick={() => {
                if (reason.id === 'other') {
                  setOther(true);
                  return;
                }
                onConfirm(reason.label, '');
              }}
            >
              <strong>{reason.label}</strong>
              <span>{reason.detail}</span>
            </button>
          ))}
        </div>
        {other && (
          <div className="other-block">
            <label htmlFor="flag-note">Note</label>
            <textarea
              id="flag-note"
              ref={noteRef}
              maxLength={80}
              value={note}
              placeholder="What should the desk know?"
              onChange={(event) => setNote(event.target.value)}
            />
            <button type="button" className="btn-block" onClick={() => onConfirm('Other', note)}>
              Flag room
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
