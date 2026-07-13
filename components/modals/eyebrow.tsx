import { Crosshair } from '../Crosshair';

// Section eyebrow tag for the past-event modal + speaker sidetray —
// 14px Founders Grotesk Medium, uppercase, crosshair marker (node 9-6651/9-6786).
export function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <h4 className="flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-mid">
      <Crosshair size={9} className="text-creme" />
      {children}
    </h4>
  );
}
