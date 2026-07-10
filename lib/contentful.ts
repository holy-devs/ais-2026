import { createClient, type Entry, type Asset } from 'contentful';

const space = process.env.CONTENTFUL_SPACE_ID;
const accessToken = process.env.CONTENTFUL_DELIVERY_TOKEN;
const environment = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!space || !accessToken) {
  throw new Error('Missing CONTENTFUL_SPACE_ID / CONTENTFUL_DELIVERY_TOKEN (set them in .env.local).');
}

// Read-only Content Delivery API client. The management token is never used at runtime.
export const cda = createClient({ space, accessToken, environment });

export async function getHomePage(): Promise<Entry | undefined> {
  const res = await cda.getEntries({
    content_type: 'page',
    'fields.slug': 'home',
    include: 6,
    limit: 1,
  });
  return res.items[0];
}

/** Contentful asset -> absolute https url (optionally width-constrained). */
export function assetUrl(asset: Asset | undefined, width?: number): string | undefined {
  const file = asset?.fields?.file;
  if (!file || typeof file.url !== 'string') return undefined;
  const base = file.url.startsWith('//') ? `https:${file.url}` : file.url;
  return width ? `${base}?w=${width}` : base;
}

export function assetTitle(asset: Asset | undefined): string {
  const t = asset?.fields?.title;
  return typeof t === 'string' ? t : 'placeholder';
}
