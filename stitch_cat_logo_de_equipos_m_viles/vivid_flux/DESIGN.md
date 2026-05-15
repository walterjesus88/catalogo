---
name: Vivid Flux
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#bac9cc'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#849396'
  outline-variant: '#3b494c'
  surface-tint: '#00daf3'
  primary: '#c3f5ff'
  on-primary: '#00363d'
  primary-container: '#00e5ff'
  on-primary-container: '#00626e'
  inverse-primary: '#006875'
  secondary: '#d7ffc5'
  on-secondary: '#053900'
  secondary-container: '#2ff801'
  on-secondary-container: '#0f6d00'
  tertiary: '#f2e9ff'
  on-tertiary: '#3c0090'
  tertiary-container: '#d9c8ff'
  on-tertiary-container: '#6c00f7'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#9cf0ff'
  primary-fixed-dim: '#00daf3'
  on-primary-fixed: '#001f24'
  on-primary-fixed-variant: '#004f58'
  secondary-fixed: '#79ff5b'
  secondary-fixed-dim: '#2ae500'
  on-secondary-fixed: '#022100'
  on-secondary-fixed-variant: '#095300'
  tertiary-fixed: '#e9ddff'
  tertiary-fixed-dim: '#d1bcff'
  on-tertiary-fixed: '#23005b'
  on-tertiary-fixed-variant: '#5700c9'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  headline-xl:
    fontFamily: Work Sans
    fontSize: 40px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Work Sans
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Work Sans
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
  label-bold:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '700'
    lineHeight: '1.2'
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1.2'
spacing:
  base: 4px
  xs: 8px
  sm: 16px
  md: 24px
  lg: 32px
  xl: 48px
  edge-margin: 20px
  gutter: 16px
---

## Brand & Style

The design system is a high-energy fusion of **Neo-Brutalism** and **Glassmorphism**, specifically engineered for a modern mobile telecom catalog. It targets a digital-native demographic that values speed, transparency, and "vibe." 

The personality is unapologetically bold. It breaks away from traditional corporate telecom aesthetics by using heavy, high-contrast strokes that define structure, contrasted against ethereal, translucent layers that represent the fluidity of data and connectivity. The emotional response is one of technological optimism and rhythmic energy. Visuals are grounded by rigid grids but elevated by vibrant, glowing accents that suggest a "hyper-connected" state.

## Colors

The design system utilizes a "Void & Neon" palette. The background is a deep, near-black neutral to provide maximum contrast for the vibrant accents. 

- **Electric Blue (Primary):** Used for primary actions, data indicators, and "active" connectivity states.
- **Neon Green (Secondary):** Used for success states, value-added features, and call-to-outs in the catalog (e.g., "In Stock" or "5G Enabled").
- **Vivid Purple (Tertiary):** Used for premium tiers, special offers, and decorative gradients.
- **Glass Layers:** White or Primary colors at 10-15% opacity with high saturation blurs to create the frosted effect.
- **Borders:** Stark white or high-contrast grey (#E0E0E0) are used for the Neo-Brutalist structural framing.

## Typography

This design system employs a dual-font strategy. **Work Sans** is used for headlines to provide a grounded, architectural feel with its robust weights. **Inter** is used for UI elements and body copy for its exceptional legibility on small screens.

Typography should be treated as a structural element. Headlines often use tight letter-spacing and heavy weights to command attention. Data points (like GB limits or pricing) should always use the `headline-xl` or `headline-lg` tokens to emphasize the "digital-first" catalog nature.

## Layout & Spacing

The layout follows a **Fluid Grid** model optimized for mobile-first viewing. We utilize a 4-column grid for standard mobile viewports with 20px outer margins. 

The spacing rhythm is strictly mathematical, based on a 4px baseline. Neo-Brutalist elements should often disregard traditional "breathable" whitespace in favor of tight, structured groupings that feel dense and information-rich. Components like cards should have 0px spacing between the border and the internal glass layer in specific "offset" layouts to emphasize the layered construction.

## Elevation & Depth

Elevation is achieved through a combination of **hard-stroke layering** and **frosted translucency**.

1.  **Level 0 (Background):** Solid neutral black.
2.  **Level 1 (The Glass):** Surface containers use `backdrop-filter: blur(20px)` with a 10% white tint. They feature a 2px solid border in high-contrast white.
3.  **Level 2 (Shadow Depth):** Components utilize "Hard Shadows"—not soft blurs. These are 4px to 8px offsets with 100% opacity, usually in the Primary or Secondary accent colors, to simulate a 3D pop typical of Neo-Brutalism.
4.  **Level 3 (Interactive):** When pressed, components lose their shadow and translate (move) 4px down and right to simulate physical compression against the background.

## Shapes

The design system adopts a **Sharp (0)** roundedness philosophy. To maintain the raw, Brutalist edge, all primary containers, buttons, and input fields utilize 0px border radii. 

Small exceptions are made for inner "glass" pills or specific tags to provide a hint of modern "tech" softness, but the structural scaffolding of the UI must remain rectangular and rigid. This creates a distinctive, aggressive silhouette that differentiates the catalog from rounded, "friendly" competitors.

## Components

### Buttons
Primary buttons use a solid Primary color fill with a 2px black inner border and a 4px secondary-colored hard shadow. Text is uppercase `label-bold`. Secondary buttons are "Ghost Glass" with white borders.

### Cards (Telecom Plans)
Cards feature a frosted glass background. The plan price is set in `headline-xl`. The border of the card should be 2px solid white. Use a hard shadow in Electric Blue for featured plans.

### Chips & Tags
Chips are used for features like "Unlimited Data" or "5G." These are the only elements allowed a `pill` shape. They should use high-saturation fills (Neon Green) with black text for maximum punch.

### Input Fields
Rectangular with a 2px white border. On focus, the border changes to the Primary color and a subtle Primary-colored glow (box-shadow) appears behind the glass surface.

### List Items
Telecom catalog items (phones, accessories) are separated by thick 2px horizontal rules. Icons are used in high-contrast white or primary color, never muted or grey.

### Progress Bars (Data Usage)
The "track" is a dark glass layer. The "fill" is a vibrant gradient from Primary to Secondary colors. No rounded corners on the bar; it remains a sharp-edged rectangle.