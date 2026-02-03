"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { createWorkout } from "@/data/workouts";

const createWorkoutSchema = z.object({
  name: z.string().min(1, "Name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

type CreateWorkoutInput = z.infer<typeof createWorkoutSchema>;

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

  revalidatePath("/dashboard");
  return { data: workout };
}
