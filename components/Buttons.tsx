import type { ReactNode } from 'react';

// White pill with a dashed divider before a trailing icon — the v5.0 button treatment
// used by Get Tickets / Request Access / Visit Archive / Revisit (see Components.png).
export function DashedButton({
  href,
  label,
  icon,
  className = '',
}: {
  href: string;
  label: string;
  icon: ReactNode;
  className?: string;
}) {
  return (
    <a href={href} className={`inline-flex items-stretch bg-white text-page transition hover:opacity-90 ${className}`}>
      <span className="px-4 py-2.5 text-sm font-medium">{label}</span>
      <span className="my-1.5 border-l border-dashed border-page/30" />
      <span className="flex items-center px-3">{icon}</span>
    </a>
  );
}
