---
name: Modern Modular System
colors:
  surface: '#fff7fe'
  surface-dim: '#e1d6e5'
  surface-bright: '#fff7fe'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#fbf0ff'
  surface-container: '#f6eaf9'
  surface-container-high: '#f0e4f3'
  surface-container-highest: '#eadfed'
  on-surface: '#1f1924'
  on-surface-variant: '#4d4354'
  inverse-surface: '#342e39'
  inverse-on-surface: '#f9edfc'
  outline: '#7e7386'
  outline-variant: '#cfc2d7'
  surface-tint: '#8621da'
  primary: '#7200c2'
  on-primary: '#ffffff'
  primary-container: '#8e2de2'
  on-primary-container: '#f1dcff'
  inverse-primary: '#ddb7ff'
  secondary: '#5f5e60'
  on-secondary: '#ffffff'
  secondary-container: '#e2dfe1'
  on-secondary-container: '#636264'
  tertiary: '#734100'
  on-tertiary: '#ffffff'
  tertiary-container: '#955600'
  on-tertiary-container: '#ffddc1'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#f0dbff'
  primary-fixed-dim: '#ddb7ff'
  on-primary-fixed: '#2c0050'
  on-primary-fixed-variant: '#6900b3'
  secondary-fixed: '#e4e2e4'
  secondary-fixed-dim: '#c8c6c8'
  on-secondary-fixed: '#1b1b1d'
  on-secondary-fixed-variant: '#474649'
  tertiary-fixed: '#ffdcbe'
  tertiary-fixed-dim: '#ffb872'
  on-tertiary-fixed: '#2d1600'
  on-tertiary-fixed-variant: '#6a3c00'
  background: '#fff7fe'
  on-background: '#1f1924'
  surface-variant: '#eadfed'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '700'
    lineHeight: '1'
    letterSpacing: 0.05em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  gutter: 24px
  margin: 48px
  container-max: 1440px
---

## Brand & Style

The design system is anchored in the "Bento Box" philosophy: a method of organization that is inherently modular, balanced, and editorial. It is designed to evoke a sense of precision and premium craftsmanship, targeting high-end technology products and professional portfolios. 

The aesthetic style is **Minimalist-Modern**, leaning heavily on structured whitespace and a rigorous grid. It avoids unnecessary ornamentation, instead using high-quality product photography and purposeful color accents to guide the eye. The emotional response is one of clarity and confidence; the interface feels like a curated gallery where every element has a designated place.

## Colors

The palette for the design system is sophisticated and high-contrast. The foundation is a soft off-white (#F5F5F7) which provides a more premium, less clinical feel than pure white. Deep charcoal (#1D1D1F) provides the weight for typography and structural elements, ensuring accessibility and authority.

The primary accent is an Electric Violet (#8E2DE2), used sparingly for high-priority actions and brand moments. To support the bento-style layout, a series of subtle background tints (derived from the primary and neutral scales) are used to differentiate grid modules without breaking the visual harmony.

## Typography

The design system utilizes **Inter** for all typographic levels to maintain a neutral, systematic, and highly legible appearance. The type hierarchy relies on significant weight shifts and tight tracking in display sizes to create an editorial feel.

Headlines should use semi-bold or bold weights with slightly negative letter spacing to feel "locked-in" and modern. Body text is optimized for readability with generous line heights. Labels are often presented in all-caps with increased letter-spacing to act as clear navigational markers within the modular grid.

## Layout & Spacing

The layout philosophy is a **Modular Fluid Grid**. Content is organized into a 12-column system, but the visual execution is defined by "Bento Tiles"—independent modules that span varying column widths and row heights.

Spacing follows an 8px rhythmic scale. A consistent 24px gutter is used between all bento tiles to maintain the modular "gap" that is characteristic of this style. Margins are generous, often starting at 48px on desktop, to frame the content and emphasize the premium, organized nature of the design system.

## Elevation & Depth

Elevation in the design system is achieved through **Tonal Layering** rather than heavy shadows. The primary background is the lowest layer. Bento tiles sit on top of this, using either subtle background tints (light greys or very pale violets) or low-contrast outlines (1px solid #E8E8ED) to define their boundaries.

When shadows are used—strictly for hovering states or floating modals—they are **Ambient Shadows**: extremely diffused, low-opacity, and tinted with the deep charcoal of the text to prevent a "dirty" look. This approach keeps the interface feeling flat yet dimensional, maintaining the cutting-edge aesthetic.

## Shapes

The shape language is the defining feature of the design system. Every module and container uses significantly rounded corners to soften the modular grid.

- **Standard Tiles:** 24px (rounded-xl) for large containers and main bento modules.
- **Interactive Elements:** 16px (rounded-lg) for buttons, input fields, and smaller nested components.
- **Photography:** Images within tiles should either be fully bled with the same 24px corner radius or "floated" within a tile with a 16px radius.

This consistency in curvature creates a cohesive, "friendly-tech" appearance that balances the sharp lines of the grid.

## Components

### Bento Tiles
The core component. Tiles must have a 24px corner radius. They can contain a mix of text, data visualizations, or high-quality photography. Tiling should be diverse (e.g., a 2x2 tile next to two 1x1 vertical tiles) to create visual interest.

### Buttons
Primary buttons use the Electric Violet (#8E2DE2) background with white text. They are medium-height with a 16px corner radius. Secondary buttons should use a subtle grey tint (#E8E8ED) with charcoal text to remain understated.

### Input Fields
Inputs are minimal, featuring a light background tint rather than a heavy border. Focus states are indicated by a 2px Electric Violet stroke.

### Chips & Tags
Used for categorization within tiles. These should be pill-shaped with a small font size and bold weights, using subtle tonal backgrounds that match the tile they reside in.

### Photography
Images should be high-resolution, featuring clean compositions and a "studio-lit" feel. Imagery should be treated as a first-class citizen of the grid, often taking up entire tiles to act as visual anchors.