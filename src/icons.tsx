type IconProps = { className?: string };

function classes(className?: string) {
  return className ? `icon ${className}` : 'icon';
}

export function IconPlay({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M8.2 5.3c0-.8.9-1.3 1.6-.9l9.3 5.7c.7.4.7 1.4 0 1.8l-9.3 5.7c-.7.4-1.6-.1-1.6-.9V5.3z" />
    </svg>
  );
}

export function IconCheck({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" d="M5 12.5 9.2 17 19 7" />
    </svg>
  );
}

export function IconFlag({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M6 3.2h1.6V21H6V3.2zm1.6 1.4h10.2l-2.3 3.7 2.3 3.7H7.6V4.6z" />
    </svg>
  );
}

export function IconSpark({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 16 16" aria-hidden="true">
      <path fill="currentColor" d="M8 1.1 9.15 6.1 14.1 8 9.15 9.9 8 14.9 6.85 9.9 1.9 8l5-1.9L8 1.1z" />
    </svg>
  );
}

export function IconSearch({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="11" cy="11" r="5.5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M15.2 15.2 19 19" />
    </svg>
  );
}

export function IconBell({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M6.2 16.2h11.6l-1.2-2V10a4.6 4.6 0 0 0-9.2 0v4.2l-1.2 2z" />
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M10 16.4a2 2 0 0 0 4 0" />
    </svg>
  );
}

export function IconPlus({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="2" strokeLinecap="round" d="M12 6v12M6 12h12" />
    </svg>
  );
}

export function IconClose({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M7 7l10 10M17 7 7 17" />
    </svg>
  );
}

export function IconChevron({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" d="M6 9.5 12 15.5 18 9.5" />
    </svg>
  );
}

export function IconCamera({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M4 8.5h3l1.6-2.2h6.8L17 8.5h3v10H4z" />
      <circle cx="12" cy="13.2" r="3.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function IconMessage({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" d="M6 16.2 4.8 19.2c-.2.5.3 1 .8.8L8.6 18.6A8 8 0 1 0 6 16.2z" />
    </svg>
  );
}

export function IconList({ className }: IconProps) {
  return (
    <svg className={classes(className)} viewBox="0 0 24 24" aria-hidden="true">
      <path stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" d="M9 7h11M9 12h11M9 17h11" />
      <path fill="currentColor" d="M4.2 6h2v2h-2zM4.2 11h2v2h-2zM4.2 16h2v2h-2z" />
    </svg>
  );
}
