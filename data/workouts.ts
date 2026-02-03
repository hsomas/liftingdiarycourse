import { db } from "@/src/db";
import { workouts } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function getWorkoutsByDate(date: Date) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const dateString = date.toISOString().split("T")[0];

  const userWorkouts = await db.query.workouts.findMany({
    where: and(eq(workouts.userId, userId), eq(workouts.date, dateString)),
    with: {
      workoutExercises: {
        with: {
          exercise: true,
          sets: true,
        },
        orderBy: (workoutExercises, { asc }) => [asc(workoutExercises.order)],
      },
    },
    orderBy: (workouts, { desc }) => [desc(workouts.createdAt)],
  });

  return userWorkouts;
}

export type WorkoutWithDetails = Awaited<
  ReturnType<typeof getWorkoutsByDate>
>[number];
