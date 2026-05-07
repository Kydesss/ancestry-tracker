---
name: Rooted Heritage
colors:
    surface: "#fbf9f8"
    surface-dim: "#dbd9d9"
    surface-bright: "#fbf9f8"
    surface-container-lowest: "#ffffff"
    surface-container-low: "#f5f3f3"
    surface-container: "#efeded"
    surface-container-high: "#eae8e7"
    surface-container-highest: "#e4e2e2"
    on-surface: "#1b1c1c"
    on-surface-variant: "#434843"
    inverse-surface: "#303030"
    inverse-on-surface: "#f2f0f0"
    outline: "#737973"
    outline-variant: "#c3c8c1"
    surface-tint: "#4d6453"
    primary: "#061b0e"
    on-primary: "#ffffff"
    primary-container: "#1b3022"
    on-primary-container: "#819986"
    inverse-primary: "#b4cdb8"
    secondary: "#5e5e5b"
    on-secondary: "#ffffff"
    secondary-container: "#e1dfdb"
    on-secondary-container: "#63635f"
    tertiary: "#231401"
    on-tertiary: "#ffffff"
    tertiary-container: "#3a2810"
    on-tertiary-container: "#a98e6e"
    error: "#ba1a1a"
    on-error: "#ffffff"
    error-container: "#ffdad6"
    on-error-container: "#93000a"
    primary-fixed: "#d0e9d4"
    primary-fixed-dim: "#b4cdb8"
    on-primary-fixed: "#0b2013"
    on-primary-fixed-variant: "#364c3c"
    secondary-fixed: "#e4e2dd"
    secondary-fixed-dim: "#c8c6c2"
    on-secondary-fixed: "#1b1c19"
    on-secondary-fixed-variant: "#474744"
    tertiary-fixed: "#fdddb9"
    tertiary-fixed-dim: "#e0c29f"
    on-tertiary-fixed: "#281803"
    on-tertiary-fixed-variant: "#584329"
    background: "#fbf9f8"
    on-background: "#1b1c1c"
    surface-variant: "#e4e2e2"
typography:
    display-lg:
        fontFamily: Newsreader
        fontSize: 48px
        fontWeight: "600"
        lineHeight: "1.1"
    headline-lg:
        fontFamily: Newsreader
        fontSize: 32px
        fontWeight: "500"
        lineHeight: "1.2"
    headline-md:
        fontFamily: Newsreader
        fontSize: 24px
        fontWeight: "500"
        lineHeight: "1.3"
    body-lg:
        fontFamily: Manrope
        fontSize: 18px
        fontWeight: "400"
        lineHeight: "1.6"
    body-md:
        fontFamily: Manrope
        fontSize: 16px
        fontWeight: "400"
        lineHeight: "1.5"
    label-sm:
        fontFamily: Manrope
        fontSize: 13px
        fontWeight: "600"
        lineHeight: "1.2"
        letterSpacing: 0.05em
rounded:
    sm: 0.25rem
    DEFAULT: 0.5rem
    md: 0.75rem
    lg: 1rem
    xl: 1.5rem
    full: 9999px
spacing:
    base: 8px
    xs: 4px
    sm: 12px
    md: 24px
    lg: 48px
    xl: 80px
    gutter: 24px
    margin: 32px
---

## Brand & Style

The design system is centered on the concept of the "Digital Heirloom." It moves away from the cold, ephemeral nature of modern SaaS platforms toward a tactile, enduring aesthetic that honors family history. The brand personality is one of a "Wise Archivist"—professional and meticulous, yet deeply warm and inviting.

The style draws from **Minimalism** for its clarity and organization, blended with **Tactile** influences through subtle depth and organic color choices. Every interface element is designed to evoke the feeling of a high-quality leather-bound journal or a curated museum exhibit. Users should feel a sense of reverence and security, trusting the platform to house their most precious multi-generational stories.

## Colors

The palette is rooted in nature and longevity.

- **Primary (Forest Green):** A deep, authoritative green used for primary actions, navigation headers, and signifying growth/life.
- **Secondary (Warm Cream):** The foundation of the platform. This replaces stark white to reduce eye strain and provide a "paper-like" warmth that feels historic rather than clinical.
- **Tertiary (Heritage Bronze):** A muted metallic/wood tone used for accents, specialized badges, and indicating historical milestones.
- **Neutral (Charcoal & Stone):** Used for secondary text and borders, avoiding pure blacks to maintain the soft, organic feel of the interface.

## Typography

This design system utilizes a high-contrast typographic pairing to balance tradition with readability.

- **Headlines:** Set in **Newsreader**. Its literary, traditional serif forms provide the "heritage" feel. Larger headings should use a slightly heavier weight to feel anchored, while sub-headers can utilize italics for a more personal, curated touch.
- **Body & UI Elements:** Set in **Manrope**. This modern sans-serif is chosen for its exceptional legibility and refined, balanced proportions. It ensures that complex data—like dates, locations, and citations—remains clear and accessible.
- **Labels:** Use uppercase Manrope with slight letter spacing for metadata and small UI labels to maintain a clean, organized hierarchy without competing with the serif headlines.

## Layout & Spacing

The design system employs a **Fixed Grid** model to ensure content feels structured and intentional, much like the layout of a published book.

- **Grid:** A 12-column grid system with a maximum width of 1280px for standard content.
- **Rhythm:** Spacing follows an 8px baseline, ensuring consistent vertical rhythm between paragraphs and components.
- **Margins:** Generous outer margins (32px+) are used to create "breathing room," preventing the complex data of family trees from feeling overwhelming. White space is treated as a premium design element to emphasize the importance of individual family members and records.

## Elevation & Depth

To achieve the "Digital Heirloom" feel, depth is communicated through **Ambient Shadows** and **Tonal Layers**.

- **Surface Tiers:** The Cream background acts as the lowest layer. Cards and containers use a slightly lighter "Paper White" to lift off the page.
- **Shadows:** Shadows are extremely soft and diffused, using a hint of the Primary Forest Green in the shadow color (e.g., 5% opacity) to ensure they feel integrated into the environment rather than a generic grey drop-shadow.
- **Interactions:** Hover states should feel like a physical lift, with the shadow expanding slightly but remaining soft. There are no harsh "pop-up" effects; transitions should be smooth and graceful.

## Shapes

The shape language is organic and approachable.

- **Corners:** A `roundedness` level of `2` (0.5rem) is applied to all standard components like cards, input fields, and buttons. This softens the interface, making it feel more human and less "tech-heavy."
- **Profiles:** Family tree nodes and profile avatars use a distinct circular or "soft-square" (high radius) shape to emphasize the individual's personality within the structural grid.
- **Iconography:** Icons should be medium-stroke line art with slightly rounded terminals to match the corner radii of the components.

## Components

The components in the design system prioritize clarity and a tactile user experience.

- **Buttons:** Primary buttons are solid Forest Green with White text. Secondary buttons use a "Heritage Bronze" outline. All buttons feature a subtle 1px top-light highlight to give them a slightly embossed, physical feel.
- **Cards (Artifacts):** Used for individual family members or historical records. Cards feature a 1px border in a slightly darker cream tone and a soft ambient shadow. Inside, the Serif typeface is used for names to give them prominence.
- **Family Tree Nodes:** Nodes are interconnected by thin, charcoal-colored paths. Each node is a compact card that uses a clear hierarchy: Name (Serif), Dates (Sans-serif), and a soft-clipping profile image.
- **Input Fields:** Designed with a subtle "inset" shadow to appear slightly recessed into the paper-like background. The focus state uses a Forest Green border.
- **Chips & Tags:** Small, pill-shaped elements with low-saturation backgrounds (e.g., soft sage or muted gold) used to categorize "Life Events" or "Record Types."
- **Timeline Rail:** A vertical or horizontal line component that uses the Heritage Bronze to connect chronological events, using small serif-labeled markers.
