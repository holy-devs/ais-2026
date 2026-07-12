import { f, mapAction } from '@/lib/map';
import RichText from '../RichText';
import { DashedButton } from '../Buttons';
import { ArrowDownRight, SendIcon } from '../Icons';

export default function TicketSection({ entry }: { entry: any }) {
  const x = f(entry);
  const actions = Array.isArray(x.actions) ? x.actions.map(mapAction) : [];
  const cta = actions[0];

  return (
    <section id="ticket-section" className="px-6 py-16 md:px-9 md:py-24">
      <div className="mx-auto flex w-full max-w-content items-stretch">
        {/* perforated left edge */}
        <div className="ticket-perf w-[15px] shrink-0" aria-hidden="true" />

        <div className="relative flex flex-1 flex-col justify-between gap-16 overflow-hidden bg-e3 p-8 md:min-h-[522px] md:p-12">
          {/* vertical dashed tear line (design: calc(50% - 86px)) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-8 left-[calc(50%-86px)] hidden border-l border-dashed border-white/25 md:block"
          />

          {/* top: index arrow (left) + heading (right) */}
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
            <ArrowDownRight className="shrink-0 text-creme" />
            <div className="max-w-[680px]">
              <h2
                className="font-grotesk text-[2rem] font-normal leading-[0.95] tracking-tight md:text-[3.25rem] lg:text-[4rem] lg:leading-[0.85]"
                data-reveal="lines"
              >
                <span className="block text-white">{x.title}</span>
                {x.supertitle && <span className="block text-creme">{x.supertitle}</span>}
              </h2>
            </div>
          </div>

          {/* bottom: body (left) + CTA (right) */}
          <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
            <RichText doc={x.text} className="max-w-[520px] text-base leading-relaxed text-white md:text-lg" />
            {cta && <DashedButton href={cta.href} label={cta.label} icon={<SendIcon />} className="self-start md:self-auto" />}
          </div>
        </div>

        {/* perforated right edge */}
        <div className="ticket-perf w-[15px] shrink-0" aria-hidden="true" />
      </div>
    </section>
  );
}
