// Shared inline icons.

export function SendIcon({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M2.5 20.5 22 12 2.5 3.5v6.6L16 12 2.5 13.9z" />
    </svg>
  );
}

// Section index marker (v5.0 "↘"). Thin diagonal line + corner arrowhead.
export function ArrowDownRight({ className = '', size = 40 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" className={className}>
      <line x1="7" y1="7" x2="33" y2="33" />
      <polyline points="15,33 33,33 33,15" />
    </svg>
  );
}

// Button/link arrow (↗).
export function ArrowUpRight({ className = '', size = 16 }: { className?: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth={1.5} aria-hidden="true" className={className}>
      <line x1="3.5" y1="12.5" x2="12.5" y2="3.5" />
      <polyline points="5,3.5 12.5,3.5 12.5,11" />
    </svg>
  );
}
