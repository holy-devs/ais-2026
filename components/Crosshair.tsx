// v5.0 signature crosshair "+" marker. Measured from design-refs: ~9px square,
// 1px stroke, pure white on dark cards / white-over-photo (reads ~#999 on the
// hero image). Color is `currentColor`, so the parent sets it via text-* classes
// (e.g. text-white, text-white/60 over photos, text-creme).

// Real crosshair glyph from design-refs/incoming/shapes/+ Vector.svg (filled +,
// 9px arm span, ~1.1px arms). viewBox cropped to the glyph so `size` = the visible +.
export function Crosshair({ size = 9, className = '' }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="4.5 4.5 9 9" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M9.5625 8.4375V4.5H8.4375V8.4375H4.5V9.5625H8.4375V13.5H9.5625V9.5625H13.5V8.4375H9.5625Z" />
    </svg>
  );
}

// Places a crosshair centered `inset` px from each corner of the nearest
// positioned ancestor. Give the parent `relative`. `corners` lets a caller
// request a subset (default all four).
type Corner = 'tl' | 'tr' | 'bl' | 'br';
export function CornerMarks({
  inset = 12,
  size = 9,
  className = 'text-white/60',
  corners = ['tl', 'tr', 'bl', 'br'],
}: {
  inset?: number;
  size?: number;
  className?: string;
  corners?: Corner[];
}) {
  // Center each size×size mark on the point `inset` px from the corner.
  const h = size / 2;
  const pos: Record<Corner, React.CSSProperties> = {
    tl: { top: inset - h, left: inset - h },
    tr: { top: inset - h, right: inset - h },
    bl: { bottom: inset - h, left: inset - h },
    br: { bottom: inset - h, right: inset - h },
  };
  return (
    <div className={`pointer-events-none absolute inset-0 ${className}`} aria-hidden="true">
      {corners.map((c) => (
        <span key={c} className="absolute block" style={pos[c]}>
          <Crosshair size={size} />
        </span>
      ))}
    </div>
  );
}
