# Authentication Coding Standards

## Overview

This application uses **Clerk** as the exclusive authentication provider. All authentication-related functionality must use Clerk's APIs and components.

---

## Provider Setup

The application is wrapped with `ClerkProvider` in the root layout.

### Rules

- **DO NOT** use any other authentication providers (NextAuth, Auth0, Firebase Auth, etc.)
- **DO NOT** implement custom authentication logic
- The `ClerkProvider` must wrap the entire application in `app/layout.tsx`

### Example

```tsx
// app/layout.tsx
import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
```

---

## Middleware

All routes are protected by Clerk middleware defined in `middleware.ts`.

### Rules

- Use `clerkMiddleware()` from `@clerk/nextjs/server`
- Configure route matchers appropriately for your application

### Example

```ts
// middleware.ts
import { clerkMiddleware } from "@clerk/nextjs/server";

export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
```

---

## Getting User ID (Server-Side)

**All server-side authentication checks MUST use the `auth()` function from `@clerk/nextjs/server`.**

### Rules

- **ALWAYS** import `auth` from `@clerk/nextjs/server`
- **ALWAYS** call `auth()` to get the authenticated user's ID
- **ALWAYS** check for `userId` before performing any data operations
- **NEVER** trust client-provided user IDs

### Example

```ts
// data/workouts.ts
import { auth } from "@clerk/nextjs/server";

export async function getWorkouts() {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  // Use userId for database queries
  return await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
  });
}
```

---

## UI Components

Use Clerk's pre-built components for authentication UI.

### Available Components

| Component | Purpose |
|-----------|---------|
| `<SignInButton>` | Renders a sign-in button |
| `<SignUpButton>` | Renders a sign-up button |
| `<SignedIn>` | Renders children only when user is signed in |
| `<SignedOut>` | Renders children only when user is signed out |
| `<UserButton>` | Renders user avatar with dropdown menu |

### Rules

- **ALWAYS** use Clerk's built-in components for sign-in/sign-up flows
- **DO NOT** create custom login/signup forms
- Use `mode="modal"` for buttons to open Clerk's modal UI

### Example

```tsx
import {
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";

export function Header() {
  return (
    <header>
      <SignedOut>
        <SignInButton mode="modal" />
        <SignUpButton mode="modal" />
      </SignedOut>
      <SignedIn>
        <UserButton />
      </SignedIn>
    </header>
  );
}
```

---

## Client-Side Auth Hooks

When you need authentication state in Client Components, use Clerk's hooks.

### Available Hooks

| Hook | Purpose |
|------|---------|
| `useUser()` | Get current user object and loading state |
| `useAuth()` | Get authentication state (userId, isSignedIn, etc.) |

### Example

```tsx
"use client";

import { useUser } from "@clerk/nextjs";

export function ProfileBadge() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <div>Loading...</div>;
  if (!user) return null;

  return <span>{user.firstName}</span>;
}
```

---

## Environment Variables

Clerk requires the following environment variables:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
```

### Rules

- **NEVER** commit these keys to version control
- Add them to `.env.local` for local development
- Configure them in your deployment platform for production

---

## Summary

| Rule | Requirement |
|------|-------------|
| Auth Provider | Clerk ONLY |
| Server-Side Auth | Use `auth()` from `@clerk/nextjs/server` |
| Client-Side Auth | Use Clerk hooks (`useUser`, `useAuth`) |
| Auth UI | Use Clerk components (`SignInButton`, `UserButton`, etc.) |
| User ID Source | Server-side `auth()` ONLY (never trust client) |
| Middleware | Use `clerkMiddleware()` |
