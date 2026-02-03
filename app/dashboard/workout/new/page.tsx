import { Suspense } from "react";
import { NewWorkoutForm } from "./new-workout-form";

export default function NewWorkoutPage() {
  return (
    <Suspense fallback={<div className="container mx-auto p-6">Loading...</div>}>
      <NewWorkoutForm />
    </Suspense>
  );
}
