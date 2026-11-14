import type { Toast } from '../types';
import { IconCheck, IconFlag, IconPlay } from '../icons';

const TONE_ICON = { go: IconPlay, done: IconCheck, flag: IconFlag, info: IconCheck };

export function ToastView({ toast }: { toast: Toast }) {
  const Icon = TONE_ICON[toast.tone];
  return (
    <div className="toast-anchor">
      <div className={`toast tone-${toast.tone}`} role="status" key={toast.id}>
        <span className="toast-icon" aria-hidden="true">
          <Icon />
        </span>
        {toast.text}
      </div>
    </div>
  );
}
