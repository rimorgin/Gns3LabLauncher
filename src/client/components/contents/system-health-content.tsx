import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import axios from "@clnt/lib/axios";

interface IDockerStats {
  Container: string;
  Name: string;
  CPUPerc: string;
  MemUsage: string;
  MemPerc: string;
  NetIO: string;
  BlockIO: string;
  PIDs: string;
}

export default function DockerStats() {
  const [stats, setStats] = useState<IDockerStats[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const statsRes = await axios("/system-stats/docker-stat");
      setStats(statsRes.data.stats);
    } catch (err) {
      console.error("Failed to fetch docker stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Helper to extract numeric value from percentage strings
  const parsePercentage = (value: string) => {
    return parseFloat(value.replace("%", "")) || 0;
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 15000);
    return () => clearInterval(interval);
  }, []);

  if (loading && stats.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-pulse text-muted-foreground">
          Loading container stats...
        </div>
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
                className="h-2 bg-amber-400"
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
                indicatorColor="bg-emerald-200"
                className="h-2 bg-emerald-500"
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
