"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { updateWorkout } from "@/data/workouts";

const updateWorkoutSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1, "Name is required").max(255),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format"),
});

type UpdateWorkoutInput = z.infer<typeof updateWorkoutSchema>;

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

  if (!workout) {
    return { error: "Workout not found" };
  }

  revalidatePath("/dashboard");
  return { data: workout };
}
