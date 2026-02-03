# Data Fetching Guidelines

## Overview

This document outlines the **mandatory** data fetching patterns for this application. These rules are critical for security, performance, and maintainability.

---

## Server Components Only

**ALL data fetching MUST be done via Server Components.**

### Allowed

- Fetching data directly in Server Components using async/await
- Passing fetched data as props to Client Components

### NOT Allowed

- Fetching data in Client Components (no `useEffect` + `fetch`)
- Fetching data via Route Handlers / API routes
- Using client-side data fetching libraries (React Query, SWR, etc.) for initial data loads
- Any other client-side data fetching method

### Example

```tsx
// CORRECT - Server Component fetching data
// app/dashboard/page.tsx
import { getWorkouts } from "@/data/workouts";

export default async function DashboardPage() {
  const workouts = await getWorkouts();

  return <WorkoutList workouts={workouts} />;
}
```

```tsx
// WRONG - Client Component fetching data
"use client";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [workouts, setWorkouts] = useState([]);

  useEffect(() => {
    fetch("/api/workouts").then(/* ... */); // DO NOT DO THIS
  }, []);

  return <WorkoutList workouts={workouts} />;
}
```

---

## Database Queries via Helper Functions

**All database queries MUST be performed through helper functions located in the `/data` directory.**

### Rules

1. Create helper functions in `/data` for all database operations
2. Use **Drizzle ORM** exclusively for queries
3. **DO NOT use raw SQL** - always use Drizzle's query builder

### Example

```ts
// CORRECT - /data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
  });
}
```

```ts
// WRONG - Raw SQL
import { db } from "@/db";
import { sql } from "drizzle-orm";

export async function getWorkouts(userId: string) {
  return await db.execute(sql`SELECT * FROM workouts WHERE user_id = ${userId}`); // DO NOT DO THIS
}
```

---

## User Data Isolation (CRITICAL)

**A logged-in user can ONLY access their own data. Users MUST NOT be able to access any other user's data.**

### Implementation Requirements

1. **Always filter by userId** - Every query must include the authenticated user's ID as a filter condition
2. **Verify authentication** - Always verify the user is authenticated before querying
3. **Never trust client input for user identification** - Always get the userId from the server-side session

### Example

```ts
// /data/workouts.ts
import { db } from "@/db";
import { workouts } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";

export async function getWorkoutById(workoutId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  // CRITICAL: Always filter by the authenticated user's ID
  const workout = await db.query.workouts.findFirst({
    where: and(
      eq(workouts.id, workoutId),
      eq(workouts.userId, session.user.id) // This ensures users only access their own data
    ),
  });

  return workout;
}
```

### Common Mistakes to Avoid

```ts
// WRONG - No user filtering (security vulnerability!)
export async function getWorkoutById(workoutId: string) {
  return await db.query.workouts.findFirst({
    where: eq(workouts.id, workoutId), // Missing userId check!
  });
}

// WRONG - Trusting client-provided userId
export async function getWorkouts(userId: string) {
  // userId comes from client - can be manipulated!
  return await db.query.workouts.findMany({
    where: eq(workouts.userId, userId),
  });
}
```

---

## Summary

| Rule | Requirement |
|------|-------------|
| Data Fetching Location | Server Components ONLY |
| Database Access | Via `/data` helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| User Data Access | Own data ONLY (always filter by authenticated userId) |
