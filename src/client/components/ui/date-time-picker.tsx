import * as React from "react";
import { ChevronDownIcon } from "lucide-react";

import { Button } from "@clnt/components/ui/button";
import { Calendar } from "@clnt/components/ui/calendar";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@clnt/components/ui/popover";

interface DateTimePickerProps {
  value?: Date;
  onChange?: (date: Date) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
  const [open, setOpen] = React.useState(false);

  const initialDate = value ? new Date(value) : undefined;
  const [datePart, setDatePart] = React.useState<Date | undefined>(initialDate);

  // Always use "23:59:00" as the time, regardless of incoming value
  const [timePart, setTimePart] = React.useState("23:59:00");

  // Combine date and time using local timezone
  React.useEffect(() => {
    if (datePart && onChange) {
      const [hours, minutes, seconds] = timePart.split(":").map(Number);
      const combined = new Date(
        datePart.getFullYear(),
        datePart.getMonth(),
        datePart.getDate(),
        hours,
        minutes,
        seconds,
      );
      onChange(combined);
    }
  }, [datePart, timePart]);

  return (
    <div className="flex gap-4">
      <div className="flex flex-col gap-3">
        <Label htmlFor="date-picker" className="px-1">
          Date
        </Label>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date-picker"
              className="w-32 justify-between font-normal"
            >
              {datePart ? datePart.toLocaleDateString() : "Select date"}
              <ChevronDownIcon />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              selected={datePart}
              captionLayout="dropdown"
              onSelect={(date) => {
                setDatePart(date);
                setOpen(false);
              }}
            />
          </PopoverContent>
        </Popover>
      </div>
      <div className="flex flex-col gap-3">
        <Label htmlFor="time-picker" className="px-1">
          Time
        </Label>
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={timePart}
          onChange={(e) => setTimePart(e.target.value)}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
    </div>
  );
}
