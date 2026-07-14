// Client-safe CTA helper — deliberately dependency-free (no lib/contentful import),
// so client components can import it without pulling the server-only Contentful
// module (whose module-level env check throws in the browser).
//
// A CTA should render only when there's a real destination — never for an empty
// value or the '#' placeholder. Single source of truth for all speaker-CTA sites.
export const hasRealCta = (url?: string): boolean => !!url && url !== '#';
