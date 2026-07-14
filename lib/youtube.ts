// Dependency-free YouTube URL helpers. Kept OUT of lib/map.ts on purpose: map.ts
// imports lib/contentful (module-level env check that throws in the browser), so a
// value import from map.ts into a client component breaks the bundle (the A5 lesson).
// These are pure string functions and safe to import into client components.

const ID = '[\\w-]{11}';

/** Extract the 11-char video id from the common YouTube URL shapes; null if none. */
export function youTubeId(url?: string): string | null {
  if (!url) return null;
  const u = url.trim();
  const patterns = [
    new RegExp(`[?&]v=(${ID})`), // watch?v=ID
    new RegExp(`youtu\\.be/(${ID})`), // youtu.be/ID
    new RegExp(`/embed/(${ID})`), // /embed/ID
    new RegExp(`/shorts/(${ID})`), // /shorts/ID
    new RegExp(`/live/(${ID})`), // /live/ID
  ];
  for (const re of patterns) {
    const m = u.match(re);
    if (m) return m[1];
  }
  if (new RegExp(`^${ID}$`).test(u)) return u; // bare id
  return null;
}

/** Poster thumbnail. maxresdefault (1280×720, true 16:9, no letterbox bars) — HD only,
    so callers should onError-fallback to youTubeThumbFallback. */
export const youTubeThumb = (id: string): string => `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

/** Always-present fallback (480×360, 4:3 — has black bars for 16:9 sources). */
export const youTubeThumbFallback = (id: string): string => `https://img.youtube.com/vi/${id}/hqdefault.jpg`;

/** Privacy-preserving embed URL; autoplay since it mounts only on an explicit click. */
export const youTubeEmbed = (id: string): string =>
  `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`;
