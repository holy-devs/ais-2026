// Maps resolved Contentful entries into plain, serializable DTOs so they can cross
// the server -> client component boundary (the raw SDK entries have circular refs).
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
import { assetUrl, assetTitle } from './contentful';

type AnyEntry = { sys: { id: string; contentType?: { sys: { id: string } } }; fields: Record<string, any> };

export const f = (entry: any): Record<string, any> => entry?.fields ?? {};
export const ctId = (entry: any): string => entry?.sys?.contentType?.sys?.id ?? '';

export function richToHtml(doc: any): string {
  if (!doc) return '';
  try { return documentToHtmlString(doc); } catch { return ''; }
}

export interface MediaDTO { url?: string; label: string; }
export function media(asset: any): MediaDTO {
  return { url: assetUrl(asset, 1600), label: assetTitle(asset) };
}

export interface SpeakerDTO {
  id: string;
  name: string;
  role: string;
  oneLiner: string;
  bioHtml: string;
  portrait: MediaDTO;
  linkedIn?: string;
  keynoteUrl?: string;
  ctaLabel: string;
  ctaUrl?: string;
  visuals: MediaDTO[];
  press: { title: string; date?: string; body: string; byline?: string }[];
}

export function mapSpeaker(entry: any): SpeakerDTO {
  const x = f(entry);
  const keynoteUrl = typeof x.url === 'string' ? x.url : undefined;
  const linkedIn = typeof x.linkedIn === 'string' ? x.linkedIn : undefined;
  const useKeynote = !!keynoteUrl && !linkedIn;
  return {
    id: entry.sys.id,
    name: x.fullName || x.contentfulName || '',
    role: x.role || '',
    oneLiner: x.oneLiner || '',
    bioHtml: richToHtml(x.bio),
    portrait: media(x.profileImage),
    linkedIn,
    keynoteUrl,
    ctaLabel: useKeynote ? 'View Keynote' : 'View LinkedIn',
    ctaUrl: useKeynote ? keynoteUrl : linkedIn,
    visuals: Array.isArray(x.visuals) ? x.visuals.map(media) : [],
    press: Array.isArray(x.press)
      ? x.press.map((c: any) => {
          const cf = f(c);
          return { title: cf.title || '', body: richToHtml(cf.richText), byline: cf.quote || undefined, date: undefined };
        })
      : [],
  };
}

export interface PastEventDTO {
  id: string;
  title: string;
  editionLabel: string;
  year?: number;
  location?: string;
  dateTime?: string;
  description: string;
  hero: MediaDTO;
  gallery: MediaDTO[];
  speakerNames: string[];
}

export function mapPastEvent(entry: any): PastEventDTO {
  const x = f(entry);
  return {
    id: entry.sys.id,
    title: x.title || x.contentfulName || '',
    editionLabel: x.editionLabel || '',
    year: typeof x.year === 'number' ? x.year : undefined,
    location: x.location || undefined,
    dateTime: x.dateTime || undefined,
    description: x.description || '',
    hero: media(x.heroMedia),
    gallery: Array.isArray(x.gallery) ? x.gallery.map(media) : [],
    speakerNames: Array.isArray(x.speakerNames) ? x.speakerNames : [],
  };
}

export interface ActionDTO { label: string; href: string; style: string }
export function mapAction(entry: any): ActionDTO {
  const x = f(entry);
  return { label: x.text || x.contentfulName || '', href: x.external || '#', style: x.style || 'Primary' };
}

/** Split a "Label | Value" textList into pairs. */
export function pairs(textList: any): { label: string; value: string }[] {
  if (!Array.isArray(textList)) return [];
  return textList.map((s: string) => {
    const i = s.indexOf('|');
    return i === -1 ? { label: '', value: s.trim() } : { label: s.slice(0, i).trim(), value: s.slice(i + 1).trim() };
  });
}

export type { AnyEntry };
