# Server Components Coding Standards

## Overview

This document outlines the **mandatory** coding standards for Server Components in this Next.js 15 application.

---

## Async Params and SearchParams (CRITICAL)

**In Next.js 15, `params` and `searchParams` are Promises and MUST be awaited.**

### Rules

1. **Always type `params` as a Promise** in page and layout components
2. **Always `await` params** before accessing their properties
3. **Never destructure params directly** from the function signature

### Example

```tsx
// CORRECT - Next.js 15 pattern
interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  // Now use id...
  const data = await getData(id);

  return <div>{data.name}</div>;
}
```

```tsx
// WRONG - This will cause runtime errors in Next.js 15
interface PageProps {
  params: { id: string }; // Missing Promise wrapper
}

export default async function Page({ params }: PageProps) {
  const { id } = params; // Not awaited - will fail!

  return <div>{id}</div>;
}
```

### Multiple Params

```tsx
// CORRECT - Multiple dynamic segments
interface PageProps {
  params: Promise<{ workoutId: string; exerciseId: string }>;
}

export default async function Page({ params }: PageProps) {
  const { workoutId, exerciseId } = await params;

  // Use both params...
}
```

### SearchParams

The same rule applies to `searchParams`:

```tsx
// CORRECT - searchParams as Promise
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string; sort?: string }>;
}

export default async function Page({ params, searchParams }: PageProps) {
  const { id } = await params;
  const { page, sort } = await searchParams;

  // Use params and searchParams...
}
```

---

## Layout Components

Layouts follow the same pattern:

```tsx
// CORRECT - Layout with async params
interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ workoutId: string }>;
}

export default async function Layout({ children, params }: LayoutProps) {
  const { workoutId } = await params;

  // Use workoutId for layout-level data fetching...

  return <div>{children}</div>;
}
```

---

## Summary

| Rule | Requirement |
|------|-------------|
| `params` type | `Promise<{ ... }>` |
| `searchParams` type | `Promise<{ ... }>` |
| Accessing params | MUST use `await` |
| Destructuring | Only after awaiting |
