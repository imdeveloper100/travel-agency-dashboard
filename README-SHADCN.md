# shadcn/ui Setup for JavaScript

This project is configured to use shadcn/ui components with JavaScript (not TypeScript).

## Adding Components

To add shadcn/ui components, you can use the CLI or manually copy components:

### Using CLI (Recommended)

```bash
npx shadcn@latest add button
```

The CLI will automatically detect your `components.json` configuration and add components in JavaScript format.

### Manual Installation

1. Copy the component code from [shadcn/ui website](https://ui.shadcn.com)
2. Convert TypeScript to JavaScript:
   - Remove type annotations
   - Change `.tsx` to `.jsx`
   - Remove `import type` statements
3. Place the component in `src/components/ui/`
4. Update imports to use `@/components/ui/...`

## Usage Example

```jsx
import { Button } from "@/components/ui/button"

function MyComponent() {
  return (
    <Button variant="default" size="lg">
      Click me
    </Button>
  )
}
```

## Available Utilities

- `cn()` function from `@/lib/utils` - merges Tailwind classes
- Path aliases configured in `vite.config.js`
- All shadcn/ui theme variables available in CSS

## Notes

- All components are in JavaScript (.jsx)
- TypeScript types are not included
- Components follow shadcn/ui patterns and conventions
