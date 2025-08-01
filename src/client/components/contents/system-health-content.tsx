import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { useSystemStatsQuery } from "@clnt/lib/queries/system-stats-query";
import Loader from "../common/loader";
import { Navigate } from "react-router";

// Helper function to parse percentage strings like "15.32%" to numbers
function parsePercentage(percentStr: string): number {
  if (!percentStr) return 0;
  const numericValue = parseFloat(percentStr.replace("%", ""));
  return isNaN(numericValue) ? 0 : Math.min(Math.max(numericValue, 0), 100);
}

export default function DockerStats() {
  // Fix: Correct the destructuring - data should be an array of IDockerStats
  const { data: stats, isLoading, isError } = useSystemStatsQuery();

  if (isLoading) return <Loader />;
  if (isError) return <Navigate to={"/errorPage"} />;

  // Add null check for stats
  if (!stats || !Array.isArray(stats)) {
    return (
      <div className="text-center text-muted-foreground">
        No container stats available
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {stats.map((container) => (
        <Card
          key={container.Container}
          className="hover:shadow-md transition-shadow"
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              {container.Name.toUpperCase()}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Container ID: {container.Container}
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">CPU Usage</span>
                <span>{container.CPUPerc}</span>
              </div>
              <Progress
                value={parsePercentage(container.CPUPerc)}
                className="h-2"
                // Fix: Remove bg-amber-400 from className, use indicatorClassName instead
                indicatorColor="bg-amber-400"
              />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Memory Usage</span>
                <span>
                  {container.MemUsage} ({container.MemPerc})
                </span>
              </div>
              <Progress
                value={parsePercentage(container.MemPerc)}
                className="h-2"
                // Fix: Use indicatorClassName instead of indicatorColor
                indicatorColor="bg-emerald-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Network I/O</p>
                <p className="text-sm font-medium">{container.NetIO}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Block I/O</p>
                <p className="text-sm font-medium">{container.BlockIO}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-muted-foreground">Processes</p>
                <p className="text-sm font-medium">{container.PIDs}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
