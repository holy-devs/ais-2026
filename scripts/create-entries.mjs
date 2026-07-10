// Phase 3 — create + publish all AIS 2026 content entries in space 5w0wu4bzlsrp/master.
//
// Idempotent: every asset/entry has a deterministic id and is upserted (update if it
// exists, create otherwise), then published. Safe to re-run.
//
// Media = clearly-named placeholder assets (1x1 PNG via the Upload API; local bytes,
// no external dependency). Named placeholder-* so they are obvious to swap later.
//
// Run:  cd ~/dev/ais-contentful && set -a && . ~/dev/ais-2026/.env && set +a \
//         && node ~/dev/ais-2026/scripts/create-entries.mjs
// (contentful-management resolves from ~/node_modules)

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const cm = require('contentful-management');

const SPACE = process.env.CONTENTFUL_SPACE_ID;
const TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
if (!SPACE || !TOKEN) { console.error('Missing CONTENTFUL_SPACE_ID / CONTENTFUL_MANAGEMENT_TOKEN'); process.exit(1); }

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
// 1x1 transparent PNG (placeholder bytes).
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64');

const client = cm.createClient(
  { accessToken: TOKEN },
  { type: 'plain', defaults: { spaceId: SPACE, environmentId: 'master' } },
);

// ---- rich text + link helpers -------------------------------------------------
const paras = (...ps) => ({
  nodeType: 'document', data: {},
  content: ps.map((p) => ({ nodeType: 'paragraph', data: {}, content: [{ nodeType: 'text', value: p, marks: [], data: {} }] })),
});
const link = (id, linkType = 'Entry') => ({ sys: { type: 'Link', linkType, id } });
const links = (ids, linkType = 'Entry') => ids.map((id) => link(id, linkType));

const notFound = (e) => e && (e.name === 'NotFound' || (e.message && /404|not ?found/i.test(String(e.message))));

async function main() {
  const localesRes = await client.locale.getMany({});
  const LOC = (localesRes.items.find((l) => l.default) || localesRes.items[0]).code;
  console.log(`locale: ${LOC}`);

  // wrap plain field map -> { field: { [LOC]: value } }
  const F = (obj) => Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined).map(([k, v]) => [k, { [LOC]: v }]));

  // ---- asset upsert (Upload API, plain client) --------------------------------
  async function upsertAsset(id, title, fileName) {
    const upload = await client.upload.create({}, { file: PNG });
    const fileVal = { contentType: 'image/png', fileName, uploadFrom: link(upload.sys.id, 'Upload') };
    const fields = { title: { [LOC]: title }, description: { [LOC]: 'Placeholder — replace before launch.' }, file: { [LOC]: fileVal } };
    let asset;
    try {
      const cur = await client.asset.get({ assetId: id });
      cur.fields = fields;
      asset = await client.asset.update({ assetId: id }, cur);
    } catch (e) {
      if (!notFound(e)) throw e;
      asset = await client.asset.createWithId({ assetId: id }, { fields });
    }
    asset = await client.asset.processForAllLocales({}, asset);
    for (let i = 0; i < 40; i++) {
      const a = await client.asset.get({ assetId: id });
      if (a.fields.file?.[LOC]?.url) { asset = a; break; }
      await sleep(750);
    }
    asset = await client.asset.get({ assetId: id });
    try { await client.asset.publish({ assetId: id }, asset); } catch (e) { console.warn(`  ! publish asset ${id}: ${e.message}`); }
    console.log(`  asset ${id}`);
    return id;
  }

  // ---- entry upsert (plain client) --------------------------------------------
  async function upsertEntry(id, ctId, fields) {
    let entry;
    try {
      const cur = await client.entry.get({ entryId: id });
      cur.fields = fields;
      entry = await client.entry.update({ entryId: id }, cur);
    } catch (e) {
      if (!notFound(e)) throw e;
      entry = await client.entry.createWithId({ contentTypeId: ctId, entryId: id }, { fields });
    }
    await client.entry.publish({ entryId: id }, entry);
    console.log(`  ${ctId} ${id}`);
    return id;
  }

  // ============================ ASSETS =========================================
  console.log('Assets…');
  await upsertAsset('ph-hero', 'placeholder-hero', 'placeholder-hero.png');
  await upsertAsset('ph-vision', 'placeholder-vision', 'placeholder-vision.png');
  await upsertAsset('ph-spk-mitsotakis', 'placeholder-speaker-mitsotakis', 'placeholder-speaker-mitsotakis.png');
  await upsertAsset('ph-spk-rottenberg', 'placeholder-speaker-rottenberg', 'placeholder-speaker-rottenberg.png');
  await upsertAsset('ph-spk-taneja', 'placeholder-speaker-taneja', 'placeholder-speaker-taneja.png');
  await upsertAsset('ph-spk-modrzewski', 'placeholder-speaker-modrzewski', 'placeholder-speaker-modrzewski.png');
  const galleryAssets = [];
  for (let i = 1; i <= 6; i++) { const id = `ph-gallery-${String(i).padStart(2, '0')}`; await upsertAsset(id, `placeholder-gallery-${String(i).padStart(2, '0')}`, `${id}.png`); galleryAssets.push(id); }
  await upsertAsset('ph-pastevent-2022', 'placeholder-pastevent-2022', 'placeholder-pastevent-2022.png');
  await upsertAsset('ph-pastevent-2025', 'placeholder-pastevent-2025', 'placeholder-pastevent-2025.png');
  const partnerAssets = [];
  for (let i = 1; i <= 8; i++) { const id = `ph-partner-${String(i).padStart(2, '0')}`; await upsertAsset(id, `placeholder-partner-${String(i).padStart(2, '0')}`, `${id}.png`); partnerAssets.push(id); }

  // ============================ ACTIONS ========================================
  console.log('Actions…');
  await upsertEntry('act-get-tickets', 'action', F({ contentfulName: 'CTA - Get Tickets', text: 'Get Tickets', external: '#ticket-section', style: 'Primary', behaviour: 'Flex' }));
  await upsertEntry('act-past-editions', 'action', F({ contentfulName: 'CTA - Past Editions', text: 'Past Editions', external: '#ais-archive', style: 'Outlined', behaviour: 'Flex' }));
  await upsertEntry('act-request-tickets', 'action', F({ contentfulName: 'CTA - Request Tickets', text: 'Request Tickets', external: 'mailto:hello@endeavor.org.gr?subject=AIS%202026%20Ticket%20Request', style: 'Primary', behaviour: 'Flex' })); // PLACEHOLDER mailto — confirm with Endeavor
  await upsertEntry('act-about-linkedin', 'action', F({ contentfulName: 'Social - LinkedIn', text: 'LINKEDIN', external: 'https://www.linkedin.com/company/endeavor-greece', style: 'Outlined' }));
  await upsertEntry('act-about-instagram', 'action', F({ contentfulName: 'Social - Instagram', text: 'INSTAGRAM', external: 'https://www.instagram.com/endeavorgr/', style: 'Outlined' }));
  await upsertEntry('act-about-youtube', 'action', F({ contentfulName: 'Social - YouTube', text: 'YOUTUBE', external: 'https://www.youtube.com/channel/UCC2SBr_wb1VwW0_Fb2tXnBQ', style: 'Outlined' }));
  await upsertEntry('act-about-website', 'action', F({ contentfulName: 'Social - Website', text: 'WEBSITE', external: 'https://www.endeavor.org.gr/', style: 'Outlined' }));

  // ============================ PERSONS ========================================
  console.log('Persons…');
  await upsertEntry('spk-mitsotakis', 'person', F({ contentfulName: 'Speaker - Kyriakos Mitsotakis', fullName: 'Kyriakos Mitsotakis', role: 'Prime Minister of Greece', oneLiner: 'Prime Minister of Greece', url: 'https://www.youtube.com/watch?v=24YTsT9qa5Q', profileImage: link('ph-spk-mitsotakis', 'Asset') }));
  await upsertEntry('spk-rottenberg', 'person', F({ contentfulName: 'Speaker - Linda Rottenberg', fullName: 'Linda Rottenberg', role: 'Endeavor · Moderator', roleHighlight: 'Moderator', oneLiner: 'Co-Founder & CEO, Endeavor', linkedIn: 'https://www.linkedin.com/in/lindarottenberg', profileImage: link('ph-spk-rottenberg', 'Asset') }));
  await upsertEntry('spk-taneja', 'person', F({ contentfulName: 'Speaker - Hemant Taneja', fullName: 'Hemant Taneja', role: 'CEO of General Catalyst', oneLiner: 'General Catalyst', linkedIn: 'https://www.linkedin.com/in/hemanttaneja', profileImage: link('ph-spk-taneja', 'Asset') }));
  await upsertEntry('spk-modrzewski', 'person', F({ contentfulName: 'Speaker - Rafal Modrzewski', fullName: 'Rafal Modrzewski', role: 'Co-Founder & CEO of ICEYE', oneLiner: 'ICEYE', linkedIn: 'https://www.linkedin.com/in/rafal-modrzewski-90446358', profileImage: link('ph-spk-modrzewski', 'Asset') }));

  // ============================ PAST EVENTS ====================================
  console.log('Past events…');
  await upsertEntry('pe-2022', 'pastEvent', F({
    contentfulName: 'Past Event - AIS 2022', title: 'Athens Innovation Summit 2022', editionLabel: 'AIS / 2022', year: 2022,
    heroMedia: link('ph-pastevent-2022', 'Asset'),
    speakerNames: ['Ted Sarandos', 'Kyriakos Mitsotakis', 'Linda Rottenberg', 'Costantza Sbokou-Constantakopoulou', 'Adrien Brody', 'Panagiotis Karampinis'],
  }));
  await upsertEntry('pe-2025', 'pastEvent', F({
    contentfulName: 'Past Event - AIS 2025', title: 'Athens Innovation Summit 2025', editionLabel: 'AIS / 2025', year: 2025,
    location: 'Odeon of Herodes Atticus', dateTime: '2025-09-12T21:00+03:00',
    description: 'On September 12th, at one of the world’s most iconic stages, Sir Demis Hassabis (CEO of Google DeepMind and 2024 Nobel Laureate) joins Greek Prime Minister Kyriakos Mitsotakis in conversation.',
    heroMedia: link('ph-pastevent-2025', 'Asset'),
    speakerNames: ['Kyriakos Mitsotakis', 'Demis Hassabis', 'Linda Rottenberg', 'Costantza Sbokou-Constantakopoulou', 'Peggy Antonakou', 'Panagiotis Karampinis'],
  }));

  // ============================ UNIQUE COMPONENTS ==============================
  console.log('Unique components…');
  await upsertEntry('uc-keywords', 'uniqueComponent', F({ contentfulName: 'Keywords Config', variant: 'Settings', json: { keywords: ['Legacy', 'Democracy', 'Intelligence', 'Frontier', 'Prosperity'] } }));
  await upsertEntry('uc-menu', 'uniqueComponent', F({
    contentfulName: 'Main Menu', variant: 'Menu',
    json: { navigation: [
      { label: 'SPEAKERS', anchor: '#speakers' }, { label: 'PROGRAM', anchor: '#program' }, { label: 'GALLERY', anchor: '#gallery' },
      { label: 'ABOUT ENDEAVOR', anchor: '#about-endeavor' }, { label: 'REQUEST TICKETS', anchor: '#ticket-section' },
    ], cta: { label: 'Get Tickets', anchor: '#ticket-section' } },
  }));
  await upsertEntry('uc-footer', 'uniqueComponent', F({
    contentfulName: 'Site Footer', variant: 'Footer',
    json: {
      subscribe: { label: 'Subscribe', placeholder: 'Email' },
      socials: [
        { label: 'LINKEDIN', url: 'https://www.linkedin.com/company/endeavor-greece' },
        { label: 'INSTAGRAM', url: 'https://www.instagram.com/endeavorgr/' },
        { label: 'YOUTUBE', url: 'https://www.youtube.com/channel/UCC2SBr_wb1VwW0_Fb2tXnBQ' },
        { label: 'TIKTOK', url: '' },
        { label: 'X/TWITTER', url: 'https://x.com/endeavorgr' },
      ],
      previousEditions: [ { label: 'AIS/22', anchor: '#ais-archive' }, { label: 'AIS/25', anchor: '#ais-archive' } ],
      copyright: '© Endeavor Greece, Inc. All Rights Reserved', craftedBy: 'Crafted by HØLY',
    },
  }));

  // ============================ SECTIONS =======================================
  console.log('Sections…');
  await upsertEntry('sec-hero', 'section', F({ contentfulName: 'Hero', variant: 'Hero', supertitle: 'by Endeavor', title: 'ATHENS INNOVATION SUMMIT 2026', actions: links(['act-get-tickets', 'act-past-editions']), keyMedia: link('ph-hero', 'Asset') }));
  await upsertEntry('sec-key-info', 'section', F({ contentfulName: 'Key Info Strip', variant: 'Key Info', textList: ['Date | July 16, 2026', 'Where | Pnyx, Athens', 'Format | By Invite Only', 'Edition | N° 03'] }));
  await upsertEntry('sec-stats', 'section', F({
    contentfulName: 'Vision Stats', variant: 'Stats', title: 'Where Athens’ Legacy Meets Its Next Chapter',
    textList: ['Editions | 03', 'Participants Attending | 10,000'],
    text: paras('Athens Innovation Summit is a global forum that bridges the timeless philosophical legacy of Greece with the urgent technological questions shaping our shared future. Launched in 2022 at the Odeon of Herodes Atticus by Endeavor Greece, the Summit convenes world leaders, entrepreneurs, scientists, and citizens to explore how innovation advances human dignity, democratic resilience, and inclusive prosperity. In 2024 it returned with a focus on one of the most pressing topics of that time: artificial intelligence, ethics, and the future of democracy. In 2026, the Summit ascends the Pnyx, the ancient hill where Athenian citizens once assembled to shape their city’s future, to continue that dialogue on the ground where it first took root. The AIS 2026 recap arrives soon'),
    keyMedia: link('ph-vision', 'Asset'),
  }));
  await upsertEntry('sec-speakers', 'section', F({ contentfulName: 'Speakers', variant: 'People', title: 'Speaker on the stage', content: links(['spk-mitsotakis', 'spk-rottenberg', 'spk-taneja', 'spk-modrzewski']) }));
  await upsertEntry('sec-thank-you', 'section', F({
    contentfulName: 'Thank You', variant: 'Standard', title: 'Thank you for being part of it.',
    text: paras('Across two editions, the Athens Innovation Summit has brought together the people building, and questioning, the future. We’re grateful to everyone who joined us and shaped these conversations on AI, democracy, and human progress. The 2026 recap is on its way. Until then, look back at where we’ve been.'),
  }));
  await upsertEntry('sec-gallery', 'section', F({ contentfulName: 'Get Inspired Gallery', variant: 'Gallery', title: 'Get Inspired From The Past', media: links(galleryAssets, 'Asset') }));
  await upsertEntry('sec-archive', 'section', F({ contentfulName: 'AIS Archive', variant: 'Archive', title: 'AIS Archive', content: links(['pe-2022', 'pe-2025']) }));
  await upsertEntry('sec-ticket', 'section', F({
    contentfulName: 'Ticket Section', variant: 'CTA', title: 'Request your tickets today', supertitle: 'Join us at the Athens Innovation Summit.',
    text: paras('This exclusive event is by invitation only. However, a select number of complimentary tickets are being reserved for public application. To request a ticket, please complete the form below. Due to high demand, not all applications may be successful. Our team will be in touch regarding the status of your request. We invite you to be part of this unparalleled discussion on AI, democracy, and the future of innovation.'),
    actions: links(['act-request-tickets']),
  }));
  await upsertEntry('sec-partners', 'section', F({ contentfulName: 'Partners', variant: 'Logo Assets', title: 'Organisers / Sponsors', logos: links(partnerAssets.slice(0, 4), 'Asset') }));
  await upsertEntry('sec-partners-secondary', 'section', F({ contentfulName: 'Partners Secondary', variant: 'Logo Assets', logos: links(partnerAssets.slice(4, 8), 'Asset') }));
  await upsertEntry('sec-about', 'section', F({
    contentfulName: 'About Endeavor', variant: 'About', title: 'About Endeavor Greece',
    text: paras('Endeavor Greece is the national office of Endeavor, the leading global community of, by, and for high-impact entrepreneurs. Since launching in 2012, Endeavor Greece has been at the epicenter of the country’s innovation ecosystem, identifying and supporting founders with the ambition to scale globally, create quality jobs, and pay it forward. Through world-class mentorship, market access, access to capital, data reports, and community initiatives, Endeavor helps entrepreneurs dream bigger, scale faster, and multiply their impact across the economy.'),
    actions: links(['act-about-linkedin', 'act-about-instagram', 'act-about-youtube', 'act-about-website']),
  }));

  // ============================ PAGE ===========================================
  console.log('Page…');
  await upsertEntry('page-home', 'page', F({
    contentfulName: 'AIS 2026 Landing', slug: 'home',
    metaTitle: 'Athens Innovation Summit 2026',
    metaDescription: 'Athens Innovation Summit 2026 — July 16, 2026, Pnyx, Athens. A global forum on AI, democracy, and human progress by Endeavor Greece.',
    content: links([
      'uc-menu', 'sec-hero', 'sec-key-info', 'sec-stats', 'sec-speakers', 'uc-keywords',
      'sec-thank-you', 'sec-gallery', 'sec-archive', 'sec-ticket', 'sec-partners',
      'sec-partners-secondary', 'sec-about', 'uc-footer',
    ]),
  }));

  console.log('\nDone. All entries created + published.');
}

main().catch((e) => { console.error('FAILED:', e); process.exit(1); });
