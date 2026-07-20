// SEO resolver: CMS page fields with the historic hardcoded values as fallbacks.
// Pure + dependency-free so the fallback behaviour is unit-testable without Next.

export const SEO_FALLBACK = {
  title: 'Athens Innovation Summit 2026',
  description:
    'Athens Innovation Summit 2026 — July 16, 2026, Pnyx, Athens. A global forum on AI, democracy, and human progress by Endeavor Greece.',
} as const;

export interface ResolvedSeo {
  title: string;
  description: string;
  ogImageUrl?: string;
}

/** A CMS field wins only when it's a non-empty string; otherwise the hardcoded fallback. */
export function resolveSeo(input: {
  metaTitle?: unknown;
  metaDescription?: unknown;
  ogImageUrl?: string;
}): ResolvedSeo {
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined);
  return {
    title: str(input.metaTitle) ?? SEO_FALLBACK.title,
    description: str(input.metaDescription) ?? SEO_FALLBACK.description,
    ogImageUrl: str(input.ogImageUrl),
  };
}
