// Upload the two design logos (Google, Endeavor) to their existing partner assets,
// then trim the two "Logo Assets" section entries so only real logos are referenced.
//   sec-partners            -> [ph-partner-01, ph-partner-02]   (Google, Endeavor)
//   sec-partners-secondary  -> []                                (sponsors: TBD from press kits)
// Approved, reversible entry edits. No new assets.
//
// Run:  cd ~/dev/ais-2026 && set -a && . ./.env && . ./.env.local && set +a \
//         && node scripts/replace-logos.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve } from 'path';
const require = createRequire(import.meta.url);
const cm = require('contentful-management');

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!SPACE || !TOKEN) { console.error('Missing token/space'); process.exit(1); }

const MEDIA = '/private/tmp/claude-503/-Users-Yiannis-dev-ais-2026/56313a17-8e06-43fc-9ac0-8d69da68a2ac/scratchpad/media';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const uploadLink = (id) => ({ sys: { type: 'Link', linkType: 'Upload', id } });
const assetLink = (id) => ({ sys: { type: 'Link', linkType: 'Asset', id } });

const LOGOS = [
  ['ph-partner-01', 'google_final.png',   'google.png',   'Google',   'Google — Organiser.'],
  ['ph-partner-02', 'endeavor_final.png', 'endeavor.png', 'Endeavor', 'Endeavor — Organiser.'],
];

const client = cm.createClient({ accessToken: TOKEN }, { type: 'plain', defaults: { spaceId: SPACE, environmentId: 'master' } });

async function replaceAssetFile(LOC, id, localFile, outName, title, desc) {
  const bytes = readFileSync(resolve(MEDIA, localFile));
  const upload = await client.upload.create({}, { file: bytes });
  let asset = await client.asset.get({ assetId: id });
  asset.fields.title = { [LOC]: title };
  asset.fields.description = { [LOC]: desc };
  asset.fields.file = { [LOC]: { contentType: 'image/png', fileName: outName, uploadFrom: uploadLink(upload.sys.id) } };
  asset = await client.asset.update({ assetId: id }, asset);
  asset = await client.asset.processForAllLocales({}, asset);
  for (let i = 0; i < 40; i++) { const a = await client.asset.get({ assetId: id }); if (a.fields.file?.[LOC]?.url) { asset = a; break; } await sleep(750); }
  await client.asset.publish({ assetId: id }, asset);
  console.log(`  ✓ asset ${id} <- ${localFile}`);
}

async function setLogos(LOC, entryId, assetIds) {
  let entry = await client.entry.get({ entryId });
  entry.fields.logos = { [LOC]: assetIds.map(assetLink) };
  entry = await client.entry.update({ entryId }, entry);
  await client.entry.publish({ entryId }, entry);
  console.log(`  ✓ entry ${entryId}.logos = [${assetIds.join(', ') || '(empty)'}]`);
}

async function main() {
  const localesRes = await client.locale.getMany({});
  const LOC = (localesRes.items.find((l) => l.default) || localesRes.items[0]).code;
  console.log(`locale: ${LOC}`);
  for (const [id, lf, out, title, desc] of LOGOS) await replaceAssetFile(LOC, id, lf, out, title, desc);
  await setLogos(LOC, 'sec-partners', ['ph-partner-01', 'ph-partner-02']);
  await setLogos(LOC, 'sec-partners-secondary', []);
  console.log('\nDone. Logos uploaded; partner sections trimmed to real logos.');
}
main().catch((e) => { console.error('FAILED:', e.message || e); process.exit(1); });
