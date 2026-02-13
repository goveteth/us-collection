# Project: UserScript Collection

## Project Overview

UserScript Collection is a userscript collection built with React + TypeScript. It uses a **modular userscript architecture** where each feature is a separate script with declarative configuration.

## Architecture Patterns

### Userscript Module System

- Each script lives in `src/scripts/{site}/{feature}/index.tsx` with this exact pattern:

  ```tsx
  const Script: Userscript = async () => {
    const ui = await createShadowRootUi({
      name: 'feature-name',
      position: 'inline',
      onMount: (container, shadowRoot, shadowHost) => {
        return reactRenderInShadowRoot(
          { uiContainer: container, shadow: shadowRoot, shadowHost },
          () => import('./app')
        )
      }
    })
    ui.mount()
  }

  Script.displayName = 'feature-name'
  Script.matches = ['https://site.com/*']
  export default Script
  ```

- Build system automatically scans `src/scripts/*/*/index.tsx` and extracts `displayName` + `matches` via AST parsing (see `scripts/script-infos.ts`)

### Shadow DOM UI Architecture

- **All UI is isolated** in Shadow DOM using `@webext-core/isolated-element`
- Use `createShadowRootUi()` for DOM injection, never manipulate DOM directly
- React components render via `reactRenderInShadowRoot()` which handles:
  - Tailwind CSS injection into shadow head
  - Mount context provider for accessing shadow DOM references
  - Lazy loading of app components

### Key Injection Patterns

```tsx
// Standard UI injection hook
useCreateUis('css-selector', async (element) => {
  return createShadowRootUi({
    name: 'unique-component-name',
    position: 'inline', // or 'overlay', 'modal'
    anchor: element,
    append: 'after', // 'before', 'first', 'last', 'replace'
    onMount: (container, shadowRoot, shadowHost) => {
      shadowHost.style.display = 'inline-block' // Common pattern
      return reactRenderInShadowRoot(
        { uiContainer: container, shadow: shadowRoot, shadowHost },
        <YourComponent />
      )
    }
  })
})
```

## Development Workflow

### Build & Development

- `pnpm dev` - Development with hot reload
- `pnpm build` - Production build for userscript managers
- Script discovery is automatic - just follow the file structure
- **Code formatting**: Don't worry about code formatting issues - the project has automatic linting/formatting that will fix them

### Auto-imports Configuration

Essential imports are auto-imported via `unplugin-auto-import`:

- React hooks: `useState`, `useEffect`, etc.
- UI helpers: `createShadowRootUi`, `reactRenderInShadowRoot`, `createIntegratedUi`
- Utilities: `cls`, `tw` for classnames
- No need to import these manually

### Tailwind Integration

- Uses Tailwind v4 with `@tailwindcss/vite` plugin
- CSS is automatically injected into shadow roots via `<InlineTailwindCSS />`
- Iconify icons available as `i-{pack}-{name}` classes (e.g., `i-bx-brain`)

## Project-Specific Conventions

### Component Organization

- App entry point: `app.tsx` in each script folder
- Components: `components/` subfolder for reusable parts
- Helpers: `helpers/` subfolder for script-specific utilities
- Hooks: `hooks/` subfolder for custom React hooks

### State Management

- Local storage helpers in `src/scripts/*/helpers/cache.ts`
- Use React Query patterns for data fetching
- Keep state minimal and component-local

### Testing Patterns

- Test on target websites directly (GitHub, DeepWiki)
- Use browser dev tools to inspect shadow DOM
- Check console for automatic script loading logs

## Common Integration Points

### GitHub Integration

- Target repository pages: `https://github.com/*/*`
- Hook into navigation elements like breadcrumbs: `nav context-region-crumb`
- GitHub's DOM is dynamic - use `useCreateUis` for element watching

### External Dependencies

- Monaco Editor: Special webpack handling in `vite.config.ts` for `unsafeWindow`
- React/ReactDOM: Loaded via CDN in production builds
- Browser extension utilities: `browser-extension-url-match` for URL pattern matching

## Anti-Patterns to Avoid

- Don't manipulate DOM directly - always use shadow root UI helpers
- Don't hardcode element selectors - use semantic CSS selectors when possible
- Don't import React/ReactDOM manually - they're externalized in builds
- Don't skip the `useCreateUis` pattern for DOM element watching
- Don't forget `shadowHost.style.display` when using inline positioning

## Tech Stack

- **Build Tool**: Vite 7.x with vite-plugin-monkey
- **Framework**: React 19.x with TypeScript 5.x
- **Styling**: TailwindCSS 4.x
- **Package Manager**: pnpm
- **Linting**: ESLint with @antfu/eslint-config, CommitLint
- **Git Hooks**: Husky with lint-staged

## Key Dependencies

- `vite-plugin-monkey`: Userscript development plugin
- `@webext-core/isolated-element`: Shadow DOM utilities
- `unplugin-auto-import`: Auto-imports for React, utilities, and project helpers
- `@monaco-editor/react`: Monaco editor integration
- `@1natsu/wait-element`: DOM element waiting utilities

## Directory Structure

```
src/
├── components/       # Reusable React components
├── contexts/         # React contexts
├── helpers/          # Utility functions
│   ├── ui/          # UI helpers (shadow-root, integrated UI)
│   └── react/       # React-specific helpers
├── hooks/           # Custom React hooks
├── scripts/         # Userscript implementations
│   ├── google/      # Google-related scripts
│   └── v2ex/        # V2EX-related scripts
└── main.ts          # Entry point
```

## Development Commands

- `pnpm dev` - Start development server
- `pnpm dev:force` - Start dev server with force flag
- `pnpm build` - Build production userscript
- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix linting issues
- `pnpm typecheck` - Run TypeScript type checking
- `pnpm release` - Bump version (uses bumpp)

## Auto-Imported Functions & Patterns

The project uses `unplugin-auto-import` for automatic imports. The following are available globally:

### React

- All React hooks and utilities (useState, useEffect, etc.)

### Classnames

- `cls()` - Tagged template for classnames
- `tw()` - Tagged template for Tailwind classes

### UI Helpers

- `createIntegratedUi()` - Create integrated UI component
- `createShadowRootUi()` - Create shadow root UI
- `reactRenderInShadowRoot()` - Render React in shadow DOM

## Code Conventions

### Userscript Structure

Each userscript should be placed in `src/scripts/{site}/{feature}/`:

- `index.tsx` - Main entry point with script metadata
- `app.tsx` - React component implementation

### TypeScript Path Aliases

- `@/*` maps to `src/*`

### UI Integration

The project provides two UI integration patterns:

1. **Shadow Root UI**: Isolated styling using Shadow DOM
2. **Integrated UI**: Direct DOM integration

### Linting & Formatting

- All files are auto-formatted on commit via lint-staged
- Follows @antfu ESLint config conventions
- Conventional commits enforced via commitlint

## Build Configuration

- **Entry**: `src/main.ts`
- **External Globals**: React and ReactDOM loaded from CDN (react-umd)
- **Grants**: `unsafeWindow`
- **Match/Include**: Dynamically generated from script definitions
- **License**: MIT

## Important Notes

- Scripts run with `noframes: true` to prevent execution in iframes
- Monaco editor has special handling for `unsafeWindow` compatibility
- Uses SWC for fast React compilation
- TailwindCSS v4 with Vite plugin for instant Tailwind compilation

## Git Workflow

- Husky hooks run on commit
- Lint-staged runs ESLint on all staged files
- Commitlint enforces conventional commit messages
- Use `pnpm release` for version bumps

## Dependencies Installation

- Use `pnpm install` for standard installation
- Use `./pnpm-clean-install.sh` for clean reinstall
