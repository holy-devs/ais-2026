// Shared inline icons.

export function SendIcon({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2.5 20.5 22 12 2.5 3.5v6.6L16 12 2.5 13.9z" />
    </svg>
  );
}
