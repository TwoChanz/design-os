# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What is Design OS?

Design OS is a **product planning and design tool** that helps users define their product vision, structure their data model, design their UI, and prepare export packages for implementation in a separate codebase.

**Key distinction**: Design OS is a planning tool, not the end product. Screen designs and components generated here are meant to be exported and integrated into a separate codebase.

## Commands

```bash
npm run dev      # Start development server (Vite)
npm run build    # TypeScript check + Vite build
npm run lint     # ESLint
npm run preview  # Preview production build
```

## Two Contexts

When working in Design OS, be aware of two distinct contexts:

### 1. Design OS Application
The React app that displays and manages planning files:
- Files live in `src/` (components, pages, utilities)
- Always uses stone/lime palette and DM Sans typography
- Provides the interface for viewing specs, screen designs, exports

### 2. Product Design (Screen Designs & Exports)
The product being planned and designed:
- Screen design components live in `src/sections/[section-name]/` and `src/shell/`
- Product definition files live in `product/`
- Exports are packaged to `product-plan/`
- Use the design tokens defined for the product (when available)

## Architecture

### Tech Stack
- React 19 + TypeScript + Vite
- Tailwind CSS v4 (no tailwind.config.js)
- React Router for routing
- Radix UI primitives for components
- Shadcn-style component patterns in `src/components/ui/`

### Key File Patterns

**Product definitions** (markdown/JSON in `product/`):
- `product/product-overview.md` - Product description, problems, features
- `product/product-roadmap.md` - Sections with titles and descriptions
- `product/data-model/data-model.md` - Entities and relationships
- `product/design-system/colors.json` and `typography.json` - Design tokens
- `product/sections/[section-id]/spec.md`, `data.json`, `types.ts` - Per-section files

**Loaders** (parse product files at build time via `import.meta.glob`):
- `src/lib/product-loader.ts` - Parses overview and roadmap markdown
- `src/lib/section-loader.ts` - Loads section specs, data, and screen designs
- `src/lib/design-system-loader.ts` - Loads color and typography tokens
- `src/lib/shell-loader.ts` - Loads shell spec

**Screen design components** (props-based, exportable):
- `src/sections/[section-id]/components/[Component].tsx` - Exportable components
- `src/sections/[section-id]/[ViewName].tsx` - Preview wrappers (import data.json)
- `src/shell/components/` - Shell components (AppShell, MainNav, UserMenu)

### Routing
Routes are defined in `src/lib/router.tsx`:
- `/` - Product overview
- `/data-model` - Data model page
- `/design` - Design system page
- `/sections` - Sections list
- `/sections/:sectionId` - Section detail
- `/sections/:sectionId/screen-designs/:screenDesignName` - Screen design preview
- `/shell/design` - Shell preview
- `/export` - Export page

## Slash Commands

Design OS uses Claude Code slash commands (defined in `.claude/commands/design-os/`):

1. `/product-vision` - Define product overview → `product/product-overview.md`
2. `/product-roadmap` - Define sections → `product/product-roadmap.md`
3. `/data-model` - Define entities → `product/data-model/data-model.md`
4. `/design-tokens` - Choose colors/typography → `product/design-system/`
5. `/design-shell` - Design navigation shell → `src/shell/components/`
6. `/shape-section` - Define section spec → `product/sections/[id]/spec.md`
7. `/sample-data` - Create sample data → `product/sections/[id]/data.json`, `types.ts`
8. `/design-screen` - Create screen designs → `src/sections/[id]/components/`
9. `/screenshot-design` - Capture screenshots → `product/sections/[id]/*.png`
10. `/export-product` - Generate export package → `product-plan/`

## Tailwind CSS v4 Rules

- **No tailwind.config.js**: Tailwind v4 does not use config files
- Use built-in utility classes exclusively
- Use built-in Tailwind colors (e.g., `stone-500`, `lime-400`)
- Design system tokens are defined in `src/index.css` using `@theme`

## Screen Design Component Rules

When creating screen design components:

1. **Props-based**: All data via props, never import data.json in exportable components
2. **Callbacks as props**: All actions as optional callback props with `?.` chaining
3. **Mobile responsive**: Use `sm:`, `md:`, `lg:`, `xl:` prefixes
4. **Light & dark mode**: Use `dark:` variants for all colors
5. **Apply design tokens**: Use product's color palette when defined
6. **No navigation**: Shell handles navigation, section designs are content-only

### Component Structure
```
src/sections/[section-id]/
├── components/
│   ├── [Component].tsx     # Exportable, props-based
│   └── index.ts            # Barrel export
└── [ViewName].tsx          # Preview wrapper (imports data.json)
```

## Design System (Design OS App)

The Design OS application itself uses:
- **Typography**: DM Sans (headings/body), IBM Plex Mono (code)
- **Colors**: Stone palette (neutrals), lime (accents)
- **Layout**: Max 800px content width, generous whitespace
- **Cards**: 1px borders, subtle shadows, generous padding
- **Motion**: 200ms fade-ins, no bouncy animations

Refer to `agents.md` for complete agent directives and file structure documentation.
