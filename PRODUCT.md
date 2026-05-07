# Product

## Register

product

## Users

Primarily families recording their own heritage: one curator (often a parent, grandparent, or family historian) builds the tree, while extended relatives collaborate by adding people, photos, stories, and life events to a shared family record. Users span generations and tech-comfort levels, from a teenager adding their cousin to a grandparent contributing a wedding photo. Sessions are intermittent and often emotional: opening the app to add a newborn, record a passing, or piece together a grandparent's early life from old documents.

Their job-to-be-done is to build a single, lasting, shared place for the family's story, one that feels worthy of the memories it holds and welcoming enough that non-technical relatives will actually use it. They are not power-user genealogists chasing citations; they are families who want their history preserved and visible to the people they love.

## Product Purpose

AncestryTracker is a collaborative family-tree app where one family's story is curated and grown together. It exists because the available tools either feel like cold genealogy databases or sterile SaaS dashboards, neither of which a family wants to sit inside while they discuss a great-grandmother. Success looks like a curator who returns weekly, extended family members who contribute without prompting, and a tree that family members proudly share with each other across generations.

## Brand Personality

Wise. Warm. Enduring.

The voice is that of a trusted archivist who happens to also be family: knowledgeable, patient, never clinical. Copy speaks plainly about people, not records. The interface should feel like a leather-bound journal kept open on a kitchen table, not a database query window. Emotionally, the goal is reverence without solemnity, warmth without sentimentality, and a quiet confidence that this is where the family story belongs.

## Anti-references

- **Generic dashboard SaaS.** No Linear-clone sidebar density, no blue or purple gradients, no sterile metric tiles, no "command center" aesthetic. This is not a tool for managing tasks; it is a place for holding people.
- **Scrapbook and craft-store kitsch.** No script fonts, no decorative corner flourishes, no sepia photo filters, no "antique paper" textures, no twee Etsy borders. Heritage is conveyed through restraint and material quality, not costume.
- **Cold tech, crypto, and AI-tool aesthetics.** No neon-on-black, no terminal monospace defaults, no glassmorphism, no aggressive motion or hyper-modern futurism. Nothing should suggest the family record lives inside a machine.
- **Legacy genealogy software.** Not Ancestry.com or MyHeritage: no dense, dated layouts, no stock-photo-heavy marketing, no information-dense forms that feel like government paperwork.

## Design Principles

1. **People before data.** A person on screen is a person first, a record second. Names get the prominence; dates, places, and IDs sit quietly underneath.
2. **Heirloom, not dashboard.** Every surface should feel like something the family would keep, not a tool they use. Treat the app's chrome with the same care as the content inside it.
3. **Welcoming to the non-technical relative.** The hardest user is a grandparent invited by their grandchild. If the interface intimidates them, the product fails its purpose. Default to plain language, generous spacing, and obvious paths.
4. **Quiet confidence over decoration.** Heritage is signaled through typography, materiality, and restraint, never through ornament. If a flourish needs explaining, remove it.
5. **Shared, not solo.** The tree belongs to the family, not to one user. Collaboration cues, attribution, and gentle signals of who-added-what should feel native, not bolted on.

## Accessibility & Inclusion

Target WCAG 2.2 AA across the application. In practice: maintain 4.5:1 contrast on body text and 3:1 on large text and UI elements, keep all interactions reachable by keyboard (including the React Flow tree canvas), provide visible focus states tinted toward the brand rather than browser-default blue, and respect `prefers-reduced-motion` for tree animations and modal transitions. Person cards, tree nodes, and avatars must carry accessible names; image-only content (photos, scanned records) requires alt text fields in the data model. Color is never the sole carrier of meaning, important when life-event types and relationship lines are visually distinguished. The product should be usable by older relatives with reduced vision and by users on assistive technology contributing to the same shared tree.
