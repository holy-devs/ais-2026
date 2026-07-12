import type { ReactNode } from 'react';

export default function Section({
  id,
  className = '',
  children,
}: {
  id?: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className={`scroll-mt-24 px-6 py-20 md:px-9 md:py-28 ${className}`}>
      <div className="mx-auto w-full max-w-[1400px]">{children}</div>
    </section>
  );
}
