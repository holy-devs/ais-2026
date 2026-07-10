import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS } from '@contentful/rich-text-types';
import type { ReactNode } from 'react';

const options = {
  renderNode: {
    [BLOCKS.PARAGRAPH]: (_node: unknown, children: ReactNode) => (
      <p className="mb-4 last:mb-0" data-reveal="lines">
        {children}
      </p>
    ),
  },
};

export default function RichText({ doc, className = '' }: { doc: any; className?: string }) {
  if (!doc) return null;
  return <div className={className}>{documentToReactComponents(doc, options)}</div>;
}
