import React, { JSX, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, Eye } from "lucide-react";
import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { ProjectDbData } from "@clnt/lib/validators/projects-schema";

interface CalendarEvent {
  id: number;
  title: string;
  date: Date;
  time: string;
  color: string;
}

const pickColorFromIndex = (index: number) => {
  const colors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-red-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-orange-500",
  ];
  return colors[index % colors.length];
};

const FullCalendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const { data: projectsQry = [], isError } = useProjectsQuery({});

  const events: CalendarEvent[] = useMemo(() => {
    if (!projectsQry || isError) return []; // empty if error or no data

    return projectsQry
      .filter((project: ProjectDbData) => project.duration)
      .map((project: ProjectDbData, index: number) => {
        const dateObj = new Date(project.duration!);

        return {
          id: project.id,
          title: project.projectName,
          date: dateObj,
          time: dateObj.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          color: pickColorFromIndex(index),
        };
      });
  }, [projectsQry, isError]);

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

  const getFirstDayOfMonth = (date: Date): number =>
    new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
    );
  };

  const getNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
    );
  };

  const selectDate = (day: number) => {
    setSelectedDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), day),
    );
  };

  const isToday = (day: number): boolean => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  const isSelected = (day: number): boolean => {
    return (
      day === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  const getEventsForDate = (day: number): CalendarEvent[] => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );
    return events.filter(
      (event) =>
        event.date.getDate() === dateToCheck.getDate() &&
        event.date.getMonth() === dateToCheck.getMonth() &&
        event.date.getFullYear() === dateToCheck.getFullYear(),
    );
  };

  const getSelectedDateEvents = (): CalendarEvent[] =>
    getEventsForDate(selectedDate.getDate());

  const renderCalendarDays = (): JSX.Element[] => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days: JSX.Element[] = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-35 w-full border border-border/50"
        ></div>,
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      days.push(
        <button
          key={day}
          onClick={() => selectDate(day)}
          className={`h-35 w-full border border-border/50 p-1 text-left hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-ring transition-colors ${
            isSelected(day)
              ? "bg-primary/10 ring-2 ring-primary"
              : isToday(day)
                ? "bg-accent"
                : "bg-background hover:bg-muted/50"
          }`}
        >
          <div className="font-medium text-sm mb-1">{day}</div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => (
              <div
                key={event.id}
                className={`text-xs px-1 py-0.5 rounded text-white truncate ${event.color}`}
              >
                {event.title}
              </div>
            ))}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground">
                +{dayEvents.length - 2} more
              </div>
            )}
          </div>
        </button>,
      );
    }

    return days;
  };

  return (
    <div className="w-full h-full mx-auto p-4">
      <div className="h-full bg-card text-card-foreground rounded-lg border shadow-sm">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center space-x-2">
            <Calendar className="h-5 w-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={getPreviousMonth}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-8 w-8"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={getNextMonth}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-accent hover:text-accent-foreground h-8 w-8"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Calendar Grid */}
          <div className="flex-1 p-4 h-full overflow-y-auto">
            <div className="grid grid-cols-7 gap-0 mb-0">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="h-10 border border-border/50 bg-muted/50 flex items-center justify-center text-sm font-medium text-muted-foreground"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="h-full grid grid-cols-7 gap-0">
              {renderCalendarDays()}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 border-l p-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-sm text-muted-foreground mb-2">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
              </div>

              <div>
                <h4 className="font-medium text-sm mb-2">Events</h4>
                <div className="space-y-2">
                  {getSelectedDateEvents().map((event) => (
                    <div
                      key={event.id}
                      className="flex items-center justify-between p-2 rounded border"
                    >
                      <div className="flex items-center space-x-2">
                        <div
                          className={`w-3 h-3 rounded-full ${event.color}`}
                        ></div>
                        <div>
                          <div className="font-medium text-sm">
                            {event.title}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center">
                            <Clock className="h-3 w-3 mr-1" />
                            {event.time}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => console.log("View event", event.id)}
                          className="p-1 hover:bg-accent rounded"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {getSelectedDateEvents().length === 0 && (
                    <p className="text-sm text-muted-foreground">
                      No events for this date
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FullCalendar;
