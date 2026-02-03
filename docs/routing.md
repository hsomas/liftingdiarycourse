# Routing Coding Standards

## Overview

This document outlines the **mandatory** routing patterns for this application.

---

## Route Structure

**ALL application routes MUST be under `/dashboard`.**

### Rules

1. The root `/dashboard` route is the main entry point for authenticated users
2. All feature routes must be nested under `/dashboard`
3. Public routes (landing page, marketing, etc.) live at the root level outside `/dashboard`

### Route Hierarchy

```
/                           # Public - Landing/marketing page
/sign-in                    # Public - Clerk sign-in
/sign-up                    # Public - Clerk sign-up
/dashboard                  # Protected - Main dashboard
/dashboard/workout/new      # Protected - Create workout
/dashboard/workout/[id]     # Protected - Edit workout
/dashboard/settings         # Protected - User settings
/dashboard/...              # Protected - All other features
```

---

## Protected Routes (CRITICAL)

**The `/dashboard` route and ALL sub-routes MUST be protected. Only authenticated users can access these routes.**

### Implementation

Route protection MUST be implemented via Next.js middleware using Clerk's `clerkMiddleware`.

### Middleware Configuration

```ts
// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

### How It Works

1. `createRouteMatcher(["/dashboard(.*)"])` matches `/dashboard` and all nested routes
2. `auth.protect()` redirects unauthenticated users to the sign-in page
3. Authenticated users proceed to the requested route

---

## Route Protection Rules

### DO

- Use middleware for route protection (centralized, runs before page renders)
- Protect all `/dashboard` routes with the single `/dashboard(.*)` matcher
- Let Clerk handle the redirect to sign-in

### DO NOT

- Protect routes inside page components (too late, page already rendered)
- Protect routes in layout components (inconsistent, can be bypassed)
- Create custom authentication checks in individual pages
- Use API route handlers for page protection

### Example - Wrong Approaches

```tsx
// WRONG - Protection in page component
export default async function DashboardPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in"); // Too late! Page already started rendering
  }
  // ...
}
```

```tsx
// WRONG - Protection in layout
export default async function DashboardLayout({ children }) {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in"); // Inconsistent, can cause issues
  }
  return <div>{children}</div>;
}
```

---

## Adding New Routes

When adding new routes to the application:

1. **Feature routes** - Add under `/dashboard/[feature-name]`
2. **Dynamic routes** - Use `[param]` syntax: `/dashboard/workout/[workoutId]`
3. **No additional middleware changes needed** - The `/dashboard(.*)` matcher covers all sub-routes

### Example

```
New feature: Exercise library
Route: /dashboard/exercises
Dynamic: /dashboard/exercises/[exerciseId]

No middleware changes required - automatically protected.
```

---

## Summary

| Rule | Requirement |
|------|-------------|
| Application routes | Under `/dashboard` ONLY |
| Route protection | Via Next.js middleware ONLY |
| Protection method | Clerk `clerkMiddleware` with `createRouteMatcher` |
| Protected pattern | `/dashboard(.*)` (covers all sub-routes) |
| Public routes | Outside `/dashboard` (root level) |
