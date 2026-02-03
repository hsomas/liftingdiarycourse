import { config } from "dotenv";
config({ path: ".env.local" });
import { drizzle } from "drizzle-orm/neon-http";
import { exercises, workouts, workoutExercises, sets } from "./schema";

const db = drizzle(process.env.DATABASE_URL!);

const USER_ID = "user_39866YJh8FP79qhdVFz1rNl0C8F";

async function seed() {
  console.log("🌱 Seeding database...");

  // 1. Insert exercises
  const exerciseData = [
    { id: "a1b2c3d4-1111-4000-8000-000000000001", name: "Barbell Bench Press", category: "Chest" },
    { id: "a1b2c3d4-1111-4000-8000-000000000002", name: "Barbell Squat", category: "Legs" },
    { id: "a1b2c3d4-1111-4000-8000-000000000003", name: "Deadlift", category: "Back" },
    { id: "a1b2c3d4-1111-4000-8000-000000000004", name: "Overhead Press", category: "Shoulders" },
    { id: "a1b2c3d4-1111-4000-8000-000000000005", name: "Barbell Row", category: "Back" },
    { id: "a1b2c3d4-1111-4000-8000-000000000006", name: "Lat Pulldown", category: "Back" },
    { id: "a1b2c3d4-1111-4000-8000-000000000007", name: "Leg Press", category: "Legs" },
    { id: "a1b2c3d4-1111-4000-8000-000000000008", name: "Dumbbell Curl", category: "Arms" },
  ];

  console.log("Inserting exercises...");
  await db.insert(exercises).values(exerciseData);

  // 2. Insert workouts
  const workoutData = [
    { id: "b2c3d4e5-2222-4000-8000-000000000001", userId: USER_ID, name: "Push Day", date: "2026-01-27" },
    { id: "b2c3d4e5-2222-4000-8000-000000000002", userId: USER_ID, name: "Pull Day", date: "2026-01-29" },
    { id: "b2c3d4e5-2222-4000-8000-000000000003", userId: USER_ID, name: "Leg Day", date: "2026-01-31" },
  ];

  console.log("Inserting workouts...");
  await db.insert(workouts).values(workoutData);

  // 3. Insert workout_exercises
  const workoutExerciseData = [
    { id: "c3d4e5f6-3333-4000-8000-000000000001", workoutId: "b2c3d4e5-2222-4000-8000-000000000001", exerciseId: "a1b2c3d4-1111-4000-8000-000000000001", order: 1, notes: "Warm up with bar first" },
    { id: "c3d4e5f6-3333-4000-8000-000000000002", workoutId: "b2c3d4e5-2222-4000-8000-000000000001", exerciseId: "a1b2c3d4-1111-4000-8000-000000000004", order: 2, notes: null },
    { id: "c3d4e5f6-3333-4000-8000-000000000003", workoutId: "b2c3d4e5-2222-4000-8000-000000000002", exerciseId: "a1b2c3d4-1111-4000-8000-000000000003", order: 1, notes: "Focus on form" },
    { id: "c3d4e5f6-3333-4000-8000-000000000004", workoutId: "b2c3d4e5-2222-4000-8000-000000000002", exerciseId: "a1b2c3d4-1111-4000-8000-000000000005", order: 2, notes: null },
    { id: "c3d4e5f6-3333-4000-8000-000000000005", workoutId: "b2c3d4e5-2222-4000-8000-000000000002", exerciseId: "a1b2c3d4-1111-4000-8000-000000000006", order: 3, notes: null },
    { id: "c3d4e5f6-3333-4000-8000-000000000006", workoutId: "b2c3d4e5-2222-4000-8000-000000000003", exerciseId: "a1b2c3d4-1111-4000-8000-000000000002", order: 1, notes: "Hit depth" },
    { id: "c3d4e5f6-3333-4000-8000-000000000007", workoutId: "b2c3d4e5-2222-4000-8000-000000000003", exerciseId: "a1b2c3d4-1111-4000-8000-000000000007", order: 2, notes: null },
  ];

  console.log("Inserting workout exercises...");
  await db.insert(workoutExercises).values(workoutExerciseData);

  // 4. Insert sets
  const setData = [
    // Push Day - Bench Press (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000001", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000001", setNumber: 1, reps: 8, weight: "60", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000002", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000001", setNumber: 2, reps: 8, weight: "70", unit: "kg", rpe: 8, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000003", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000001", setNumber: 3, reps: 6, weight: "80", unit: "kg", rpe: 9, notes: "Felt strong" },
    // Push Day - Overhead Press (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000004", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000002", setNumber: 1, reps: 8, weight: "40", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000005", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000002", setNumber: 2, reps: 8, weight: "45", unit: "kg", rpe: 8, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000006", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000002", setNumber: 3, reps: 6, weight: "50", unit: "kg", rpe: 9, notes: null },
    // Pull Day - Deadlift (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000007", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000003", setNumber: 1, reps: 5, weight: "100", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000008", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000003", setNumber: 2, reps: 5, weight: "120", unit: "kg", rpe: 8, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000009", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000003", setNumber: 3, reps: 3, weight: "140", unit: "kg", rpe: 10, notes: "PR attempt" },
    // Pull Day - Barbell Row (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000010", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000004", setNumber: 1, reps: 10, weight: "60", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000011", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000004", setNumber: 2, reps: 10, weight: "70", unit: "kg", rpe: 8, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000012", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000004", setNumber: 3, reps: 8, weight: "75", unit: "kg", rpe: 9, notes: null },
    // Pull Day - Lat Pulldown (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000013", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000005", setNumber: 1, reps: 12, weight: "50", unit: "kg", rpe: 6, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000014", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000005", setNumber: 2, reps: 12, weight: "55", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000015", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000005", setNumber: 3, reps: 10, weight: "60", unit: "kg", rpe: 8, notes: null },
    // Leg Day - Squat (4 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000016", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000006", setNumber: 1, reps: 5, weight: "80", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000017", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000006", setNumber: 2, reps: 5, weight: "100", unit: "kg", rpe: 8, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000018", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000006", setNumber: 3, reps: 5, weight: "110", unit: "kg", rpe: 9, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000019", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000006", setNumber: 4, reps: 3, weight: "120", unit: "kg", rpe: 10, notes: "Grinder" },
    // Leg Day - Leg Press (3 sets)
    { id: "d4e5f6a7-4444-4000-8000-000000000020", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000007", setNumber: 1, reps: 12, weight: "140", unit: "kg", rpe: 6, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000021", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000007", setNumber: 2, reps: 12, weight: "160", unit: "kg", rpe: 7, notes: null },
    { id: "d4e5f6a7-4444-4000-8000-000000000022", workoutExerciseId: "c3d4e5f6-3333-4000-8000-000000000007", setNumber: 3, reps: 10, weight: "180", unit: "kg", rpe: 8, notes: null },
  ];

  console.log("Inserting sets...");
  await db.insert(sets).values(setData);

  console.log("✅ Seeding complete!");
  console.log(`   - 8 exercises`);
  console.log(`   - 3 workouts`);
  console.log(`   - 7 workout exercises`);
  console.log(`   - 22 sets`);
}

seed().catch((err) => {
  console.error("❌ Seeding failed:", err);
  process.exit(1);
});
