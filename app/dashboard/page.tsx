"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Mock workout data for UI demonstration
const mockWorkouts = [
  {
    id: 1,
    name: "Bench Press",
    sets: 4,
    reps: 8,
    weight: 135,
  },
  {
    id: 2,
    name: "Squat",
    sets: 5,
    reps: 5,
    weight: 225,
  },
  {
    id: 3,
    name: "Deadlift",
    sets: 3,
    reps: 5,
    weight: 275,
  },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-[240px] justify-start">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(date, "do MMM yyyy")}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => newDate && setDate(newDate)}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">
          Workouts for {format(date, "do MMM yyyy")}
        </h2>

        {mockWorkouts.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-center">
                No workouts logged for this date.
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {mockWorkouts.map((workout) => (
              <Card key={workout.id}>
                <CardHeader>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>
                    {workout.sets} sets x {workout.reps} reps @ {workout.weight}{" "}
                    lbs
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
