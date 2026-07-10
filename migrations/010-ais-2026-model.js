// Phase 2 migration for the AIS 2026 build (space 5w0wu4bzlsrp / master).
//
// EDITS existing types (person, section) and CREATES one new type (pastEvent).
// Everything here is ADDITIVE: no field or type is modified destructively, nothing
// is deleted. Enum extensions only append values; reference whitelists only append
// link targets.
//
// This is an EDIT migration (like migrations-edits/edit-seo-features.js in
// ../ais-contentful): it must be run standalone with the contentful-migration CLI
// or runMigration({ filePath }). Do NOT run it through the ordered migrations/
// runner in ../ais-contentful (that set re-creates types and would collide).
//
// Approved diff:
//   A. section.variant  += [Key Info, Stats, Gallery, Archive]        (append only)
//   B. person           += oneLiner, bio, visuals, press              (new fields)
//   C. pastEvent        =  new content type                          (new type)
//   D. section.content  += [person, pastEvent]                        (append targets)
//   +  section.media    =  new optional Array<Asset>                  (new field)
// Keywords: handled at ENTRY time via uniqueComponent(Settings).json  (no model change)

// Reuse the exact RichText validation set the base uses for atomic/body copy
// (card.richText): restrained node set, standard marks.
const RICH_TEXT_VALIDATIONS = [
  {
    enabledMarks: ['bold', 'italic', 'underline', 'code', 'superscript', 'subscript', 'strikethrough'],
    message: 'Only bold, italic, underline, code, superscript, subscript, and strikethrough marks are allowed',
  },
  {
    enabledNodeTypes: ['heading-3', 'heading-4', 'heading-5', 'heading-6', 'ordered-list', 'unordered-list', 'hyperlink'],
    message: 'Only heading 3, heading 4, heading 5, heading 6, ordered list, unordered list, and link to Url nodes are allowed',
  },
  { nodes: {} },
];

// section.variant: the 12 existing values, unchanged, plus the 4 approved additions.
const SECTION_VARIANTS = [
  // existing (do not reorder or remove)
  'Hero', 'Standard', 'Case Study', 'Logo Assets', 'About', 'CTA',
  'FAQ', 'Icon List', 'People', 'Code', 'Accordion', 'Values Highlight',
  // appended for AIS 2026
  'Key Info', 'Stats', 'Gallery', 'Archive',
];

// section.content: existing link targets plus the two approved additions.
const SECTION_CONTENT_LINKS = ['card', 'richText', 'scriptEmbed', 'person', 'pastEvent'];

module.exports = function (migration) {
  // ---------------------------------------------------------------------------
  // C. New type: pastEvent (thin, supportive-style; referenced by section.content,
  //    no slug/page of its own, mirroring the `person` pattern).
  //    Created FIRST so section.content can reference it later in this migration.
  // ---------------------------------------------------------------------------
  const pastEvent = migration
    .createContentType('pastEvent')
    .name('Past Event')
    .displayField('contentfulName')
    .description('Supportive. An AIS past edition shown in the Archive and its Past Event modal.');

  pastEvent.createField('contentfulName').name('Contentful Name').type('Symbol').required(true);
  pastEvent.createField('title').name('Title').type('Symbol');
  pastEvent.createField('editionLabel').name('Edition Label').type('Symbol'); // e.g. "AIS / 2025"
  pastEvent.createField('year').name('Year').type('Integer'); // sortable, e.g. 2025
  pastEvent.createField('heroMedia').name('Hero Media').type('Link').linkType('Asset');
  pastEvent.createField('location').name('Location').type('Symbol'); // e.g. "Odeon of Herodes Atticus"
  pastEvent.createField('dateTime').name('Date and Time').type('Date');
  pastEvent.createField('description').name('Description').type('Text');
  pastEvent.createField('gallery').name('Gallery').type('Array')
    .items({ type: 'Link', linkType: 'Asset' });
  // Modal lists speakers as plain text, not references.
  pastEvent.createField('speakerNames').name('Speaker Names').type('Array')
    .items({ type: 'Symbol' });

  pastEvent.changeFieldControl('description', 'builtin', 'multipleLine');

  // ---------------------------------------------------------------------------
  // B. Extend person -> speaker. Additive fields only; nothing existing touched.
  // ---------------------------------------------------------------------------
  const person = migration.editContentType('person');

  person.createField('oneLiner').name('One Liner').type('Symbol'); // card tagline
  person.createField('bio').name('Bio').type('RichText')
    .validations(RICH_TEXT_VALIDATIONS); // Speaker Profile modal bio
  person.createField('visuals').name('Visuals').type('Array')
    .items({ type: 'Link', linkType: 'Asset' }); // modal "Visuals" grid
  person.createField('press').name('Press').type('Array')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['card'] }] }); // "On the Record" cards
  // Keynote vs LinkedIn CTA reuse existing person.url (keynote) and person.linkedIn.

  // ---------------------------------------------------------------------------
  // A + D + section.media. Extend section without disturbing existing config.
  // ---------------------------------------------------------------------------
  const section = migration.editContentType('section');

  // A. Append the four new variant values (validations replace, so pass the full list).
  section.editField('variant').validations([{ in: SECTION_VARIANTS }]);

  // D. Append person + pastEvent to the content whitelist (full list, appended).
  section.editField('content')
    .items({ type: 'Link', linkType: 'Entry', validations: [{ linkContentType: SECTION_CONTENT_LINKS }] });

  // New optional media array for Gallery / Archive image grids (no logos reuse).
  section.createField('media').name('Media').type('Array')
    .items({ type: 'Link', linkType: 'Asset' });
};
