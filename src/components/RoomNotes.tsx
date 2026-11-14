import { useRef } from 'react';
import type { Room } from '../types';
import { IconCamera, IconClose } from '../icons';

type Props = {
  room: Room;
  onEdit: (patch: Partial<Room>, label?: string) => void;
};

export function RoomNotes({ room, onEdit }: Props) {
  const fileRef = useRef<HTMLInputElement>(null);

  function addPhotos(files: FileList | null) {
    if (!files?.length) return;
    const urls = [...files].map((file) => URL.createObjectURL(file));
    onEdit({ photos: [...room.photos, ...urls] }, urls.length === 1 ? 'Added a photo' : `Added ${urls.length} photos`);
  }

  function removePhoto(url: string) {
    URL.revokeObjectURL(url);
    onEdit({ photos: room.photos.filter((photo) => photo !== url) });
  }

  return (
    <>
      <label className="field-label" htmlFor="room-note">
        Note
      </label>
      <textarea
        id="room-note"
        className="note"
        rows={3}
        placeholder="Shared with the desktop board."
        value={room.note}
        onChange={(event) => onEdit({ note: event.target.value })}
      />

      <p className="field-label">Photos</p>
      {room.photos.length > 0 && (
        <ul className="photos">
          {room.photos.map((url, i) => (
            <li key={url}>
              <img src={url} alt={`Photo ${i + 1} of room ${room.number}`} />
              <button type="button" aria-label={`Remove photo ${i + 1}`} onClick={() => removePhoto(url)}>
                <IconClose />
              </button>
            </li>
          ))}
        </ul>
      )}
      <button type="button" className="add-photo" onClick={() => fileRef.current?.click()}>
        <IconCamera />
        Add a photo
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        hidden
        onChange={(event) => {
          addPhotos(event.target.files);
          event.target.value = '';
        }}
      />
    </>
  );
}
