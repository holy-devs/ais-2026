import type { ReactNode } from 'react';

// v5.0 button system (review A1): two containers (text + icon) joined by a dashed
// connector; fill = 20% white + backdrop blur (glassy, not solid). Hover: the
// connector fades and the two blocks rotate 15° outwards. Text-only when no icon.
export function GlassButton({
  href,
  onClick,
  label,
  icon,
  external = false,
  className = '',
}: {
  href?: string;
  onClick?: () => void;
  label: string;
  icon?: ReactNode;
  external?: boolean;
  className?: string;
}) {
  const cls =
    'group relative inline-flex items-stretch overflow-visible border-b border-white/40 ' +
    // Mobile-reduced blur (12px) → desktop 40px, to avoid backdrop-filter jank on phones.
    'bg-white/20 text-white backdrop-blur-md md:backdrop-blur-2xl transition-colors hover:bg-white/25 ' +
    className;

  const content = (
    <>
      <span className="origin-right px-4 py-2.5 text-sm font-medium transition-transform duration-300 will-change-transform group-hover:-rotate-[15deg]">
        {label}
      </span>
      {icon && (
        <>
          <span aria-hidden className="my-2 self-stretch border-l border-dashed border-white/60 transition-opacity duration-300 group-hover:opacity-0" />
          <span className="flex origin-left items-center px-3 transition-transform duration-300 will-change-transform group-hover:rotate-[15deg]">
            {icon}
          </span>
        </>
      )}
    </>
  );

  if (href) {
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} className={cls}>
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
