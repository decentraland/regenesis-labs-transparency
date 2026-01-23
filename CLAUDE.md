# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
npm run dev       # Start dev server (port 8080)
npm run build     # Production build
npm run lint      # Run ESLint
npm run preview   # Preview production build
```

## Architecture

This is a React 18 + TypeScript dashboard built with Vite, using shadcn/ui components and Tailwind CSS for styling.

### Key Patterns

- **Path alias**: Use `@/` for imports from `src/` (e.g., `@/components/ui/button`)
- **UI components**: shadcn/ui components live in `src/components/ui/`. Add new ones via shadcn CLI
- **Custom components**: Dashboard-specific components in `src/components/` (Header, MetricCard, BalanceChart, etc.)
- **Styling**: Use `cn()` utility from `@/lib/utils` to merge Tailwind classes
- **Routing**: React Router v6 in `App.tsx`. Add routes above the catch-all `*` route

### Project Structure

```
src/
├── components/ui/     # shadcn/ui primitives (auto-generated)
├── components/        # Custom dashboard components
├── pages/             # Route components
├── hooks/             # Custom React hooks
└── lib/               # Utilities (cn function)
```

## Notes

- No test framework is currently configured
- Built with Lovable platform - changes sync bidirectionally with lovable.dev
