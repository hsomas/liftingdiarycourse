import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { WorkoutWithDetails } from "@/data/workouts";

interface WorkoutListProps {
  workouts: WorkoutWithDetails[];
  date: Date;
}

export function WorkoutList({ workouts, date }: WorkoutListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">
        Workouts for {format(date, "do MMM yyyy")}
      </h2>

      {workouts.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground text-center">
              No workouts logged for this date.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {workouts.map((workout) => (
            <Card key={workout.id}>
              <CardHeader>
                <CardTitle>{workout.name || "Workout"}</CardTitle>
                <CardDescription>
                  {workout.workoutExercises.length} exercise
                  {workout.workoutExercises.length !== 1 ? "s" : ""}
                </CardDescription>
              </CardHeader>
              {workout.workoutExercises.length > 0 && (
                <CardContent>
                  <div className="space-y-3">
                    {workout.workoutExercises.map((workoutExercise) => (
                      <div
                        key={workoutExercise.id}
                        className="border-l-2 border-muted pl-3"
                      >
                        <p className="font-medium">
                          {workoutExercise.exercise.name}
                        </p>
                        <div className="text-sm text-muted-foreground">
                          {workoutExercise.sets.map((set, index) => (
                            <span key={set.id}>
                              {index > 0 && " | "}
                              {set.reps} reps @ {set.weight} {set.unit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
