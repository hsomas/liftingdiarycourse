import Link from "next/link";
import { getWorkoutsByDate } from "@/data/workouts";
import { Button } from "@/components/ui/button";
import { DatePicker } from "./date-picker";
import { WorkoutList } from "./workout-list";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

/** Get today's date as YYYY-MM-DD string in UTC to ensure consistency */
function getTodayDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  // Use date string directly to avoid timezone conversion issues
  const selectedDateString = params.date || getTodayDateString();

  const workouts = await getWorkoutsByDate(selectedDateString);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild>
            <Link href="/dashboard/workout/new">New Workout</Link>
          </Button>
        </div>
        <DatePicker selectedDateString={selectedDateString} />
      </div>

      <WorkoutList workouts={workouts} dateString={selectedDateString} />
    </div>
  );
}
