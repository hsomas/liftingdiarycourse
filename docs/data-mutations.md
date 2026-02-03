# Data Mutations Guidelines

## Overview

This document outlines the **mandatory** data mutation patterns for this application. These rules ensure type safety, validation, and maintainability.

---

## Server Actions Only

**ALL data mutations MUST be done via Server Actions.**

### Rules

1. Server Actions must be defined in colocated files named `actions.ts`
2. Place `actions.ts` files alongside the components/pages that use them
3. Always add `"use server"` directive at the top of the file

### File Structure Example

```
app/
  workouts/
    page.tsx
    actions.ts       # Server actions for this route
  workouts/[id]/
    page.tsx
    actions.ts       # Server actions for this route
```

---

## Database Mutations via Helper Functions

**All database mutations MUST be performed through helper functions located in the `src/data` directory.**

### Rules

1. Create helper functions in `src/data` for all database operations (insert, update, delete)
2. Use **Drizzle ORM** exclusively for mutations
3. **DO NOT use raw SQL** - always use Drizzle's query builder
4. Server actions should call these helper functions, not interact with the database directly

### Example

```ts
// CORRECT - src/data/workouts.ts
import { db } from "@/db";
import { workouts, NewWorkout } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(data: NewWorkout) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

export async function updateWorkout(
  id: string,
  userId: string,
  data: Partial<NewWorkout>
) {
  const [workout] = await db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function deleteWorkout(id: string, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

```ts
// WRONG - Database call directly in server action
"use server";

import { db } from "@/db";
import { workouts } from "@/db/schema";

export async function createWorkoutAction(data: WorkoutInput) {
  // DO NOT DO THIS - database calls should be in src/data
  await db.insert(workouts).values(data);
}
```

---

## Typed Parameters (No FormData)

**Server action parameters MUST be typed. DO NOT use FormData.**

### Rules

1. Define explicit TypeScript types/interfaces for all action parameters
2. **Never use `FormData`** as a parameter type
3. Convert form data to typed objects in the client before calling the action

### Example

```ts
// CORRECT - Typed parameters
"use server";

interface CreateWorkoutInput {
  name: string;
  date: string;
}

export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ...
}
```

```ts
// WRONG - FormData parameter
"use server";

export async function createWorkoutAction(formData: FormData) {
  // DO NOT DO THIS
  const name = formData.get("name");
  const date = formData.get("date");
}
```

### Client-Side Usage

```tsx
// CORRECT - Convert form data to typed object before calling action
"use client";

import { createWorkoutAction } from "./actions";

function CreateWorkoutForm() {
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    // Convert to typed object
    const input = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
    };

    await createWorkoutAction(input);
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

---

## Zod Validation (Required)

**ALL server actions MUST validate their arguments using Zod.**

### Rules

1. Define a Zod schema for every server action's input
2. Validate input at the beginning of every server action
3. Return validation errors to the client in a structured format
4. **Never trust client input** - always validate on the server

### Example

```ts
// CORRECT - Full server action with Zod validation
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(input: CreateWorkoutInput) {
  // 1. Validate input with Zod
  const result = createWorkoutSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  // 2. Authenticate user
  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // 3. Call data helper function
  const workout = await createWorkout({
    ...result.data,
    userId,
  });

  return { data: workout };
}
```

```ts
// WRONG - No validation
"use server";

export async function createWorkoutAction(input: CreateWorkoutInput) {
  // DO NOT DO THIS - no validation!
  const workout = await createWorkout(input);
  return workout;
}
```

---

## No Redirects in Server Actions

**Server actions MUST NOT use `redirect()`. All redirects should be performed client-side after the server action resolves.**

### Rules

1. **DO NOT** import or use `redirect` from `next/navigation` in server actions
2. Return data from server actions to indicate success/failure
3. Handle redirects in the client component after the action completes

### Example

```ts
// WRONG - redirect in server action
"use server";

import { redirect } from "next/navigation";

export async function createWorkoutAction(input: CreateWorkoutInput) {
  // ... validation and creation logic

  // DO NOT DO THIS
  redirect("/dashboard");
}
```

```tsx
// CORRECT - redirect on client after action resolves
"use client";

import { useRouter } from "next/navigation";
import { createWorkoutAction } from "./actions";

function CreateWorkoutForm() {
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const input = {
      name: formData.get("name") as string,
      date: formData.get("date") as string,
    };

    const result = await createWorkoutAction(input);

    if (result.error) {
      // Handle error
      return;
    }

    // Redirect on client after success
    router.push("/dashboard");
  }

  return <form onSubmit={handleSubmit}>{/* ... */}</form>;
}
```

---

## User Data Isolation (CRITICAL)

**A logged-in user can ONLY mutate their own data. Users MUST NOT be able to modify any other user's data.**

### Implementation Requirements

1. **Always verify authentication** before performing any mutation
2. **Always include userId in mutations** - ensure the data belongs to the authenticated user
3. **Never trust client input for user identification** - always get the userId from the server-side session

### Example

```ts
// src/data/workouts.ts
export async function deleteWorkout(id: string, userId: string) {
  // CRITICAL: Always filter by userId to prevent unauthorized deletions
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

```ts
// app/workouts/actions.ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { deleteWorkout } from "@/data/workouts";

const deleteWorkoutSchema = z.object({
  id: z.string().uuid(),
});

export async function deleteWorkoutAction(input: { id: string }) {
  const result = deleteWorkoutSchema.safeParse(input);

  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const { userId } = await auth();

  if (!userId) {
    return { error: "Unauthorized" };
  }

  // Pass authenticated userId - never trust client-provided userId
  await deleteWorkout(result.data.id, userId);

  return { success: true };
}
```

---

## Complete Example

Here's a complete example following all the guidelines:

### Data Helper (`src/data/workouts.ts`)

```ts
import { db } from "@/db";
import { workouts, NewWorkout } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function createWorkout(data: NewWorkout) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

export async function updateWorkout(
  id: string,
  userId: string,
  data: { name?: string; date?: string }
) {
  const [workout] = await db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)))
    .returning();
  return workout;
}

export async function deleteWorkout(id: string, userId: string) {
  await db
    .delete(workouts)
    .where(and(eq(workouts.id, id), eq(workouts.userId, userId)));
}
```

### Server Actions (`app/workouts/actions.ts`)

```ts
"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout, updateWorkout, deleteWorkout } from "@/data/workouts";

// Schemas
const createWorkoutSchema = z.object({
  name: z.string().min(1).max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

const deleteWorkoutSchema = z.object({
  id: z.string().uuid(),
});

// Types
type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;
type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;
type DeleteWorkoutInput = z.infer<typeof deleteWorkoutSchema>;

// Actions
export async function createWorkoutAction(input: CreateWorkoutInput) {
  const result = createWorkoutSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const workout = await createWorkout({
    ...result.data,
    userId,
  });

  revalidatePath("/workouts");
  return { data: workout };
}

export async function updateWorkoutAction(input: UpdateWorkoutInput) {
  const result = updateWorkoutSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  const { id, ...data } = result.data;
  const workout = await updateWorkout(id, userId, data);

  revalidatePath("/workouts");
  return { data: workout };
}

export async function deleteWorkoutAction(input: DeleteWorkoutInput) {
  const result = deleteWorkoutSchema.safeParse(input);
  if (!result.success) {
    return { error: result.error.flatten() };
  }

  const { userId } = await auth();
  if (!userId) {
    return { error: "Unauthorized" };
  }

  await deleteWorkout(result.data.id, userId);

  revalidatePath("/workouts");
  return { success: true };
}
```

---

## Summary

| Rule | Requirement |
|------|-------------|
| Mutation Method | Server Actions ONLY |
| Action File Location | Colocated `actions.ts` files |
| Database Access | Via `src/data` helper functions ONLY |
| ORM | Drizzle ORM ONLY (no raw SQL) |
| Parameter Types | Typed objects ONLY (no FormData) |
| Validation | Zod validation REQUIRED for all actions |
| Redirects | Client-side ONLY (no `redirect()` in server actions) |
| User Data Access | Own data ONLY (always filter by authenticated userId) |
