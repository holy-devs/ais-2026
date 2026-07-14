import type { ReactNode } from 'react';

// v5.0 button system (review A1): two containers (text + icon) joined by a dashed
// connector; fill = 20% white + backdrop blur (glassy, not solid). Hover: fill
// lightens + the connector fades (no rotate/splay — 2a). Text-only when no icon.
export function GlassButton({
  href,
  onClick,
  label,
  icon,
  external = false,
  fullWidth = false,
  centered = false,
  variant = 'glass',
  className = '',
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon?: ReactNode;
  external?: boolean;
  fullWidth?: boolean;
  // M2: vertically (and horizontally) center the label within the stretched button.
  // Opt-in so hero/nav buttons are untouched; used by the footer Subscribe button.
  centered?: boolean;
  // M10: 'solid' = white fill + black text/arrow + dark dashed connector (Revisit /
  // Visit Archive). 'glass' (default) keeps the blurred hero/nav/Subscribe treatment.
  variant?: 'glass' | 'solid';
  className?: string;
}) {
  const solid = variant === 'solid';
  const cls =
    'group relative inline-flex items-stretch overflow-visible border-b transition-colors ' +
    (solid
      ? // Solid: white fill, black ink; hover TBD by designer → default bg-white/90.
        'border-black/20 bg-white text-black hover:bg-white/90 '
      : // Mobile-reduced blur (12px) → desktop 40px, to avoid backdrop-filter jank on phones.
        'border-white/40 bg-white/20 text-white backdrop-blur-md md:backdrop-blur-2xl hover:bg-white/25 ') +
    (fullWidth ? 'w-full ' : '') +
    className;
  // Dashed connector: dark on the solid (white) fill so it stays visible.
  const connector = solid ? 'border-black/40' : 'border-white/60';

  const content = (
    <>
      <span
        className={`${fullWidth ? 'flex-1 text-center' : ''} ${centered ? 'flex items-center justify-center' : ''} origin-right px-4 py-2.5 text-sm font-medium`}
      >
        {label}
      </span>
      {icon && (
        <>
          <span aria-hidden className={`my-2 self-stretch border-l border-dashed ${connector} transition-opacity duration-300 group-hover:opacity-0`} />
          <span className="flex origin-left items-center px-3">
            {icon}
          </span>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
        className={cls}
      >
        {content}
      </a>
    );
  }
  return (
    <button type="button" onClick={onClick} className={cls}>
      {content}
    </button>
  );
}
