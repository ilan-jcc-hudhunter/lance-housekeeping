import type { Priority } from '../types';
import { PRIORITY_LABEL } from '../priority';

const BARS: Record<Priority, number> = { high: 3, medium: 2, low: 1 };

export function PriorityIcon({ priority }: { priority: Priority }) {
  const label = `${PRIORITY_LABEL[priority]} priority`;
  return (
    <span className={`priority priority-${priority}`} role="img" aria-label={label} title={label}>
      <svg viewBox="0 0 14 12" aria-hidden="true">
        {[3, 6, 9].map((height, i) => (
          <rect
            key={height}
            x={1 + i * 4.5}
            y={11 - height}
            width="3"
            height={height}
            rx="1"
            opacity={i < BARS[priority] ? 1 : 0.22}
          />
        ))}
      </svg>
    </span>
  );
}
