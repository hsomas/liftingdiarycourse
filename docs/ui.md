# UI Coding Standards

## Component Library

This project uses **shadcn/ui** as the exclusive component library.

### Rules

- **ONLY** use shadcn/ui components for all UI elements
- **DO NOT** create custom components
- If a component is needed, install it from shadcn/ui using `npx shadcn@latest add <component>`

### Available Components

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components.

---

## Date Formatting

All date formatting must use **date-fns**.

### Format

Dates should be displayed in the following format:

```
1st Sep 2025
2nd Aug 2025
3rd Jan 2026
4th Jun 2024
```

### Implementation

Use the `format` function from date-fns with the pattern `do MMM yyyy`:

```typescript
import { format } from "date-fns";

const formattedDate = format(new Date(), "do MMM yyyy");
// Output: "1st Sep 2025"
```
