import { db } from "@/src/db";
import { workouts, NewWorkout } from "@/src/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

export async function createWorkout(data: NewWorkout) {
  const [workout] = await db.insert(workouts).values(data).returning();
  return workout;
}

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

export async function getWorkoutById(workoutId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workout = await db.query.workouts.findFirst({
    where: and(eq(workouts.id, workoutId), eq(workouts.userId, userId)),
  });

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
