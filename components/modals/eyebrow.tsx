import { Crosshair } from '../Crosshair';

// Section eyebrow tag for the past-event modal + speaker sidetray — 14px Founders
// Grotesk Medium, uppercase, crosshair marker. `tone` sets the text color: modal
// eyebrows are muted (text-mid, 9-6651); sidetray eyebrows are white (9-6786).
export function Eyebrow({ children, tone = 'text-mid' }: { children: React.ReactNode; tone?: string }) {
  return (
    <h4 className={`flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] ${tone}`}>
      <Crosshair size={9} className="text-creme" />
      {children}
    </h4>
  );
}
