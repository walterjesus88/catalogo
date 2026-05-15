---
name: Corporate Connectivity System
colors:
  surface: '#fbf9f8'
  surface-dim: '#dcd9d9'
  surface-bright: '#fbf9f8'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f6f3f2'
  surface-container: '#f0eded'
  surface-container-high: '#eae8e7'
  surface-container-highest: '#e4e2e1'
  on-surface: '#1b1c1c'
  on-surface-variant: '#454651'
  inverse-surface: '#303030'
  inverse-on-surface: '#f3f0f0'
  outline: '#757683'
  outline-variant: '#c5c5d3'
  surface-tint: '#4758ab'
  primary: '#00093c'
  on-primary: '#ffffff'
  primary-container: '#001970'
  on-primary-container: '#7687de'
  inverse-primary: '#b9c3ff'
  secondary: '#ba0a06'
  on-secondary: '#ffffff'
  secondary-container: '#df2d1f'
  on-secondary-container: '#fffbff'
  tertiary: '#001127'
  on-tertiary: '#ffffff'
  tertiary-container: '#00264b'
  on-tertiary-container: '#3b8eec'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dee1ff'
  primary-fixed-dim: '#b9c3ff'
  on-primary-fixed: '#001258'
  on-primary-fixed-variant: '#2e3f92'
  secondary-fixed: '#ffdad4'
  secondary-fixed-dim: '#ffb4a8'
  on-secondary-fixed: '#410000'
  on-secondary-fixed-variant: '#930001'
  tertiary-fixed: '#d4e3ff'
  tertiary-fixed-dim: '#a5c8ff'
  on-tertiary-fixed: '#001c3a'
  on-tertiary-fixed-variant: '#004785'
  background: '#fbf9f8'
  on-background: '#1b1c1c'
  surface-variant: '#e4e2e1'
typography:
  h1:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  h2:
    fontFamily: Work Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  h3:
    fontFamily: Work Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Work Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Work Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Work Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.05em
  button:
    fontFamily: Work Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  base: 8px
  xs: 4px
  sm: 12px
  md: 24px
  lg: 40px
  xl: 64px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
---

## Brand & Style

The design system is engineered for the high-stakes telecommunications sector, prioritizing institutional trust, clarity, and efficiency. It adopts a **Corporate / Modern** style that balances the authoritative heritage of traditional carriers with the sleekness of modern digital-first services. 

The aesthetic is characterized by a "Flat+" approach: predominantly flat surfaces and solid fills to ensure rapid cognitive processing, supplemented by subtle depth cues only where interaction is required. The emotional response is one of reliability and transparency, ensuring users feel secure while browsing high-value device catalogs and service plans.

## Colors

This design system utilizes a high-contrast palette to distinguish between brand identity and actionable items. 

- **Primary Blue (#001970):** Used for structural elements, headers, and primary navigation to establish a foundation of stability.
- **Vibrant Red (#DA291C):** Reserved strictly for primary Calls to Action (CTAs), alerts, and promotional badges to ensure high visibility against the blue and white.
- **Tertiary Blue (#0072CE):** A lighter blue variant used for secondary actions, links, and illustrative icons to prevent the interface from feeling overly heavy.
- **Neutral Grey (#333333):** Applied to all body copy and headings to maintain professional legibility.
- **Backgrounds:** A crisp white (#FFFFFF) is the primary canvas, with a very light cool grey (#F5F7FA) used for section alternating to define content boundaries without the use of heavy lines.

## Typography

The design system employs **Work Sans** for its exceptional readability in mobile contexts and its professional, neutral character. 

Hierarchy is established through weight and scale rather than decorative flourishes. Headlines use a bold weight with tighter letter spacing for a modern, "impactful" corporate feel. Body text maintains a generous line height (1.5x) to ensure large blocks of plan details or technical specifications are easily digestible on mobile screens. A specialized "Label-Caps" style is used for small metadata, such as "Limited Time Offer" or category tags.

## Layout & Spacing

The design system follows a **Mobile-First Fluid Grid** with a strict 8px base unit. 

- **Grid:** On mobile devices, a 4-column grid is used with 16px margins. On tablet and desktop, this scales to an 8 or 12-column system respectively.
- **Rhythm:** Generous whitespace is utilized to separate product tiers. Vertical spacing between distinct catalog sections (e.g., "Featured Phones" vs "Data Plans") should use the `lg` (40px) or `xl` (64px) tokens to prevent visual clutter.
- **Padding:** Content inside cards and containers must maintain a minimum `md` (24px) padding to ensure high-quality product photography has room to breathe.

## Elevation & Depth

Visual depth in this design system is restrained to maintain a clean, flat corporate look. 

- **Subtle Shadows:** Applied only to interactive cards (product listings, plan cards). Use a low-intensity, large-spread shadow (e.g., `0 4px 20px rgba(0, 0, 0, 0.05)`) to create a "lift" effect that signifies clickability.
- **Tonal Layering:** Surfaces are primarily flat white. When a secondary level of depth is needed (e.g., a sticky bottom bar for "Buy Now" or a filter drawer), use a 1px border in a light grey (#E0E0E0) instead of a heavy shadow.
- **Active State:** On press/touch, elements should shift slightly in color density rather than increasing in elevation, keeping the experience grounded.

## Shapes

The shape language is structured and geometric. A standard **8px (0.5rem)** corner radius is applied to all primary containers, buttons, and product images. This "Soft" rounding strikes a balance between the friendliness of consumer tech and the precision of corporate enterprise.

- **Buttons:** 8px rounded corners.
- **Cards:** 8px rounded corners with clipped imagery.
- **Input Fields:** 4px (0.25rem) rounded corners to emphasize a more technical, functional appearance.
- **Badges:** Fully rounded (pill-shaped) for promotional tags to distinguish them from structural elements.

## Components

- **Buttons:** 
  - *Primary:* Solid Vibrant Red (#DA291C) with white text. Used for the final "Purchase" or "Select Plan" action.
  - *Secondary:* Outline Primary Blue (#001970) or solid light grey. Used for "Learn More" or "Compare."
- **Catalog Cards:** Feature a top-aligned high-quality image on a white background, followed by a H3 title, price point in Primary Blue, and a full-width Red CTA button.
- **Plan Chips:** Use for data amounts (e.g., "10GB", "Unlimited"). Small containers with a subtle 1px border that turns solid Primary Blue when selected.
- **Input Fields:** Clean, white backgrounds with 1px #333333 borders. Focus states transition the border to Primary Blue.
- **Status Badges:** Small pill shapes using secondary colors (e.g., a lighter green for "In Stock") with bold, uppercase typography.
- **Progress Steppers:** Used for the checkout flow, featuring thin lines and numbered circles in Primary Blue to guide the user through the multi-stage conversion funnel.