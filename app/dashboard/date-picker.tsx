"use client";

import { useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  /** Date string in YYYY-MM-DD format to avoid timezone issues */
  selectedDateString: string;
}

export function DatePicker({ selectedDateString }: DatePickerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse date string on client side to ensure correct local timezone handling
  const selectedDate = useMemo(() => {
    const [year, month, day] = selectedDateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  }, [selectedDateString]);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      const params = new URLSearchParams(searchParams.toString());
      // Format using local date components to avoid timezone shifts
      const year = newDate.getFullYear();
      const month = String(newDate.getMonth() + 1).padStart(2, "0");
      const day = String(newDate.getDate()).padStart(2, "0");
      params.set("date", `${year}-${month}-${day}`);
      router.push(`/dashboard?${params.toString()}`);
      router.refresh();
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {format(selectedDate, "do MMM yyyy")}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={handleDateSelect}
        />
      </PopoverContent>
    </Popover>
  );
}
