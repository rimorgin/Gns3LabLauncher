import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@clnt/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";

type MetricWithTrend = {
  value: number;
  trend: number | null;
};

export interface SectionCardsProps {
  data: {
    activeClassrooms: MetricWithTrend;
    totalStudents: MetricWithTrend;
    totalInstructors: MetricWithTrend;
    totalOnlineUsers: MetricWithTrend;
    submissionsThisMonth: MetricWithTrend;
    projectsInProgress: MetricWithTrend;
    avgProgress: MetricWithTrend;
  };
}

export function SectionCards({ data }: SectionCardsProps) {
  const cards = [
    {
      label: "Active Classrooms",
      value: data.activeClassrooms.value,
      trend: data.activeClassrooms.trend,
      description: "Active classrooms in the system",
    },
    {
      label: "Total Students",
      value: data.totalStudents.value,
      trend: data.totalStudents.trend,
      description: "Enrolled students",
    },
    {
      label: "Total Intructors",
      value: data.totalInstructors.value,
      trend: data.totalInstructors.trend,
      description: "Current instructors",
    },
    {
      label: "Online users",
      value: data.totalOnlineUsers.value,
      trend: data.totalOnlineUsers.trend,
      description: "All current online users",
    },
    {
      label: "Submissions This Month",
      value: data.submissionsThisMonth.value,
      trend: data.submissionsThisMonth.trend,
      description: "Student project submissions",
    },
    {
      label: "Projects In Progress",
      value: data.projectsInProgress.value,
      trend: data.projectsInProgress.trend,
      description: "Ongoing projects",
    },
    {
      label: "Average Progress",
      value: `${data.avgProgress.value}%`,
      trend: data.avgProgress.trend,
      description: "Avg. project completion rate",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map((card) => {
        const isTrend = card.trend === null ? false : true;
        const isPositive = (card.trend ?? 0) >= 0;
        const TrendIcon = isPositive ? IconTrendingUp : IconTrendingDown;

        return (
          <Card key={card.label} className="@container/card">
            <CardHeader>
              <CardDescription>{card.label}</CardDescription>
              <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
                {card.value}
              </CardTitle>
              {isTrend && (
                <CardAction>
                  <Badge
                    variant="outline"
                    className={isPositive ? "text-green-600" : "text-red-600"}
                  >
                    <TrendIcon />
                    {card.trend !== null ? `${card.trend.toFixed(1)}%` : "N/A"}
                  </Badge>
                </CardAction>
              )}
            </CardHeader>
            <CardFooter className="flex-col items-start gap-1.5 text-sm">
              <div className="line-clamp-1 flex gap-2 font-medium">
                {card.description} <TrendIcon className="size-4" />
              </div>
              <div className="text-muted-foreground">
                Compared to last month
              </div>
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}
