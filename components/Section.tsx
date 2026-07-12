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
    <section id={id} className={`scroll-mt-24 section-y px-6 md:px-9 ${className}`}>
      <div className="mx-auto w-full max-w-content">{children}</div>
    </section>
  );
}
