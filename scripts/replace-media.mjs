// Replace placeholder files with real media pulled from Figma v5.0.
// Same asset IDs — new file bytes only. NO new assets, NO entry edits.
// Photos = original full-res source; gallery = 2x node export; archive = hi-res mosaic.
//
// Run:  cd ~/dev/ais-2026 && set -a && . ./.env && . ./.env.local && set +a \
//         && node scripts/replace-media.mjs
import { createRequire } from 'module';
import { readFileSync } from 'fs';
import { resolve } from 'path';
const require = createRequire(import.meta.url);
const cm = require('contentful-management');

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!SPACE || !TOKEN) { console.error('Missing CONTENTFUL_SPACE_ID / CONTENTFUL_MANAGEMENT_TOKEN'); process.exit(1); }

const MEDIA = '/private/tmp/claude-503/-Users-Yiannis-dev-ais-2026/56313a17-8e06-43fc-9ac0-8d69da68a2ac/scratchpad/media';
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const link = (id, linkType = 'Upload') => ({ sys: { type: 'Link', linkType, id } });
const ct = (fn) => (fn.endsWith('.jpeg') || fn.endsWith('.jpg')) ? 'image/jpeg' : 'image/png';

// asset id -> { file (local), name (out filename), title, description }
const PLAN = [
  ['ph-hero',            'n3823_raw1.png',  'hero-odeon.png',            'Odeon of Herodes Atticus at night',      'Odeon of Herodes Atticus, Athens — night.'],
  ['ph-vision',          'n3883_raw1.jpeg', 'vision-odeon-crowd.jpg',    'Athens Innovation Summit — Odeon audience','Audience filling the Odeon of Herodes Atticus.'],
  ['ph-spk-mitsotakis',  'n3916_raw1.jpeg', 'speaker-mitsotakis.jpg',    'Kyriakos Mitsotakis',                    'Kyriakos Mitsotakis, Prime Minister of Greece.'],
  ['ph-spk-rottenberg',  'n3928_raw1.png',  'speaker-rottenberg.png',    'Linda Rottenberg',                       'Linda Rottenberg, Co-Founder & CEO, Endeavor.'],
  ['ph-spk-taneja',      'n3940_raw1.png',  'speaker-taneja.png',        'Hemant Taneja',                          'Hemant Taneja, CEO of General Catalyst.'],
  ['ph-gallery-01',      'g01.png',         'gallery-01.png',            'AIS Gallery 01',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-02',      'g02.png',         'gallery-02.png',            'AIS Gallery 02',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-03',      'g03.png',         'gallery-03.png',            'AIS Gallery 03',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-04',      'g04.png',         'gallery-04.png',            'AIS Gallery 04',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-05',      'g05.png',         'gallery-05.png',            'AIS Gallery 05',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-06',      'g06.png',         'gallery-06.png',            'AIS Gallery 06',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-07',      'g07.png',         'gallery-07.png',            'AIS Gallery 07',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-08',      'g08.png',         'gallery-08.png',            'AIS Gallery 08',                         'Athens Innovation Summit — past edition.'],
  // reuse 4 real photos for the Load-More slots (no design source beyond 8)
  ['ph-gallery-09',      'g05.png',         'gallery-09.png',            'AIS Gallery 09',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-10',      'g06.png',         'gallery-10.png',            'AIS Gallery 10',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-11',      'g07.png',         'gallery-11.png',            'AIS Gallery 11',                         'Athens Innovation Summit — past edition.'],
  ['ph-gallery-12',      'g08.png',         'gallery-12.png',            'AIS Gallery 12',                         'Athens Innovation Summit — past edition.'],
  ['ph-pastevent-2022',  'arc2022_raw1.png','pastevent-2022.png',        'AIS 2022',                               'Athens Innovation Summit 2022.'],
  ['ph-pastevent-2025',  'arc2025_raw1.png','pastevent-2025.png',        'AIS 2025',                               'Athens Innovation Summit 2025.'],
];

const client = cm.createClient({ accessToken: TOKEN }, { type: 'plain', defaults: { spaceId: SPACE, environmentId: 'master' } });

async function main() {
  const localesRes = await client.locale.getMany({});
  const LOC = (localesRes.items.find((l) => l.default) || localesRes.items[0]).code;
  console.log(`locale: ${LOC}  |  assets to replace: ${PLAN.length}`);

  for (const [id, localFile, outName, title, desc] of PLAN) {
    const bytes = readFileSync(resolve(MEDIA, localFile));
    const upload = await client.upload.create({}, { file: bytes });
    let asset = await client.asset.get({ assetId: id });          // must exist (fail loud if not)
    asset.fields.title = { [LOC]: title };
    asset.fields.description = { [LOC]: desc };
    asset.fields.file = { [LOC]: { contentType: ct(localFile), fileName: outName, uploadFrom: link(upload.sys.id) } };
    asset = await client.asset.update({ assetId: id }, asset);
    asset = await client.asset.processForAllLocales({}, asset);
    let url;
    for (let i = 0; i < 40; i++) {
      const a = await client.asset.get({ assetId: id });
      url = a.fields.file?.[LOC]?.url;
      if (url) { asset = a; break; }
      await sleep(750);
    }
    await client.asset.publish({ assetId: id }, asset);
    console.log(`  ✓ ${id.padEnd(20)} <- ${localFile.padEnd(18)} (${outName})`);
  }
  console.log('\nDone. 24 files replaced + published. No entries touched.');
}
main().catch((e) => { console.error('FAILED:', e.message || e); process.exit(1); });
