import { getWorkoutsByDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";
import { WorkoutList } from "./workout-list";

interface DashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const params = await searchParams;
  // Parse date with local timezone to avoid off-by-one day issues
  const selectedDate = params.date
    ? new Date(params.date + "T00:00:00")
    : new Date();

  const workouts = await getWorkoutsByDate(selectedDate);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
        <DatePicker selectedDate={selectedDate} />
      </div>

      <WorkoutList workouts={workouts} date={selectedDate} />
    </div>
  );
}
