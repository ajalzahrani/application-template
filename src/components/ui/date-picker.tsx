"use client";

import { Button } from "@/components/ui/button";

import Link from "next/link";
import { Calendar as CalendarIcon } from "lucide-react";

import { Calendar } from "@/components/datepicker/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { format } from "date-fns";
import { cn } from "@/lib/utils";

export function DatePicker({
  date,
  setDate,
}: {
  date: Date;
  setDate: (date: Date) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}>
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className=" w-auto p-0">
        <Calendar
          mode="single"
          captionLayout="dropdown-buttons"
          selected={date}
          onSelect={(day) => setDate(day || new Date())}
          fromYear={1960}
          toYear={2030}
        />
      </PopoverContent>
    </Popover>
  );
}
