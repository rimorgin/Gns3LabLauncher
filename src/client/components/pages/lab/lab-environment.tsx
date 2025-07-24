"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Alert, AlertDescription } from "@clnt/components/ui/alert";
import {
  Play,
  Square,
  Monitor,
  Network,
  Server,
  Router,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BrickWallFire,
  MonitorCogIcon,
} from "lucide-react";
import type { LabEnvironment, TopologyNode } from "@clnt/types/lab";
import socket from "@clnt/lib/socket";
import { IconCloud, IconWorld } from "@tabler/icons-react";
import { NavLink } from "react-router";
import { ScrollArea } from "@clnt/components/ui/scroll-area";
import { cn } from "@clnt/lib/utils";

interface LabEnvironmentProps {
  environment: LabEnvironment;
  onLaunch: () => void;
  onStop: () => void;
  isRunning: boolean;
  isLoading: boolean;
}

export function LabEnvironmentComponent({
  environment,
  onLaunch,
  onStop,
  isRunning,
  isLoading,
}: LabEnvironmentProps) {
  const [selectedDevices, setSelectedDevices] = useState<TopologyNode | null>(
    null,
  );

  const [logs, setLogs] = useState<string[]>([]);

  useEffect(() => {
    const handleLog = ({
      containerName,
      log,
    }: {
      containerName: string;
      log: string;
    }) => {
      setLogs((prev) => [...prev, `[${containerName}] ${log.trim()}`]);
    };

    socket.on("container-log", handleLog);

    return () => {
      socket.off("container-log", handleLog);
    };
  }, []);

  useEffect(() => {
    const area = document.getElementById("logs-scroll");
    area?.scrollTo({ top: area.scrollHeight, behavior: "smooth" });
  }, [logs]);

  const getdevicesColor = (type: string) => {
    const colors = {
      router: "text-blue-700",
      switch: "text-green-600",
      pc: "text-gray-700",
      server: "text-amber-700",
      firewall: "text-red-900",
      cloud: "text-cyan-600",
    };
    const color = colors[type as keyof typeof colors] || "text-blue-700";
    return color;
  };

  const getdevicesIcon = (type: string) => {
    const icons = {
      router: Router,
      switch: Network,
      pc: Monitor,
      server: Server,
      firewall: BrickWallFire,
      cloud: IconCloud,
    };
    const Icon = icons[type as keyof typeof icons] || Monitor;
    const iconColor = getdevicesColor(type);
    return <Icon className={cn(iconColor, "h-6 w-6")} />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "running":
      case "up":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "starting":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "error":
      case "down":
        return <AlertCircle className="h-4 w-4 text-red-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const renderTopology = () => {
    const nodes = environment.topology?.nodes ?? [];
    const notes = environment.topology?.notes ?? [];
    const links = environment.topology?.links ?? [];

    if (nodes.length === 0 && notes.length === 0) return;

    const offset = 100;

    // collect all x/y points for nodes and notes
    const allPoints = [
      ...nodes.map((n) => ({ x: n.x, y: n.y })),
      ...notes.map((n) => ({ x: n.x, y: n.y })),
      ...notes.map((n) => ({ x: n.x + n.width, y: n.y + n.height })),
    ];

    const minX = Math.min(...allPoints.map((p) => p.x));
    const maxX = Math.max(...allPoints.map((p) => p.x));
    const minY = Math.min(...allPoints.map((p) => p.y));
    const maxY = Math.max(...allPoints.map((p) => p.y));

    const newWidth = maxX - minX + offset * 2;
    const newHeight = maxY - minY + offset * 2;

    return (
      <div className="relative bg-gray-50 rounded-lg">
        <div className="w-full h-full border border-gray-200 rounded bg-white">
          <svg
            viewBox={`${minX - offset} ${minY - offset} ${newWidth} ${newHeight}`}
          >
            {/* grid */}
            <defs>
              <pattern
                id="grid"
                width="30"
                height="30"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 30 0 L 0 0 0 30"
                  fill="none"
                  stroke="#f0f0f0"
                  strokeWidth="1"
                />
              </pattern>
            </defs>

            <rect
              x={minX - offset}
              y={minY - offset}
              width={newWidth}
              height={newHeight}
              fill="url(#grid)"
            />

            {/* Links */}
            {links.map((link) => {
              const sourceNode = nodes.find((n) => n.id === link.source);
              const targetNode = nodes.find((n) => n.id === link.target);
              if (!sourceNode || !targetNode) return null;

              const dx = targetNode.x - sourceNode.x;
              const dy = targetNode.y - sourceNode.y;
              const length = Math.sqrt(dx * dx + dy * dy);
              const unitX = dx / length;
              const unitY = dy / length;
              const portOffset = 100;

              return (
                <g key={link.id}>
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke="#3B3B3B"
                    strokeWidth="2"
                    strokeDasharray={link.status === "down" ? "5,5" : "none"}
                  />

                  <foreignObject
                    x={sourceNode.x + unitX * portOffset}
                    y={sourceNode.y + unitY * portOffset}
                    width="100"
                    height="50"
                    style={{ pointerEvents: "none" }}
                  >
                    <p className="w-max text-xs md:text-lg text-black bg-white/80 shadow">
                      {link.sourcePort}
                    </p>
                  </foreignObject>

                  <foreignObject
                    x={targetNode.x - unitX * portOffset}
                    y={targetNode.y - unitY * portOffset}
                    width="100"
                    height="50"
                    style={{ pointerEvents: "none" }}
                  >
                    <p className="w-max text-xs md:text-lg text-black bg-white/50 rounded shadow">
                      {link.targetPort}
                    </p>
                  </foreignObject>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill="white"
                  stroke="#3B3B3B"
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-blue-500"
                />
                <text
                  x={node.x}
                  y={node.y + 40}
                  textAnchor="middle"
                  className="text-sm font-medium fill-gray-700"
                >
                  {node.name}
                </text>
                <foreignObject
                  x={node.x - 12}
                  y={node.y - 12}
                  width="24"
                  height="24"
                >
                  <div className="flex items-center justify-center text-gray-600">
                    {getdevicesIcon(node.type)}
                  </div>
                </foreignObject>
              </g>
            ))}

            {/* Notes */}
            {notes.map((note) => (
              <g key={note.id}>
                <foreignObject
                  x={note.x}
                  y={note.y}
                  width={note.width}
                  height={note.height}
                >
                  <p className="font-medium text-gray-700">{note.text}</p>
                </foreignObject>
              </g>
            ))}
          </svg>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Environment Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Lab Environment
              </CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={isRunning ? "default" : "secondary"}>
                  {isRunning ? "Running" : "Stopped"}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  {environment.topology.nodes.length} devices •{" "}
                  {environment.topology.links.length} connections
                </span>
              </div>
            </div>
            <div className="flex gap-2">
              {!isRunning ? (
                <Button onClick={onLaunch} disabled={isLoading}>
                  <Play className="h-4 w-4 mr-2" />
                  {isLoading ? "Starting..." : "Launch Lab"}
                </Button>
              ) : (
                <>
                  <Button variant="default" onClick={() => {}}>
                    <MonitorCogIcon className="h-4 w-4 mr-2" />
                    View web console
                  </Button>
                  {/* <Button variant="outline" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button> */}
                  <Button
                    variant="destructive"
                    onClick={onStop}
                    disabled={isLoading}
                  >
                    <Square className="h-4 w-4 mr-2" />
                    {isLoading ? "Stopping..." : "Stop Lab"}
                  </Button>
                </>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Environment Details */}
      <Tabs defaultValue="topology" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="topology">Network Topology</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="console">Console</TabsTrigger>
          <TabsTrigger value="logs">Logs</TabsTrigger>
        </TabsList>

        <TabsContent value="topology" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Network Topology</CardTitle>
            </CardHeader>
            <CardContent>{renderTopology()}</CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-4">
          <div className="grid md:grid-cols-2 gap-5">
            {environment.topology.nodes.map((devices) => (
              <Card
                key={devices.id}
                className={`cursor-pointer transition-colors ${
                  selectedDevices?.id === devices.id
                    ? "ring-2 ring-primary"
                    : "hover:bg-muted/50"
                }`}
                onClick={() => setSelectedDevices(devices)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getdevicesIcon(devices.type)}
                      <div>
                        <CardTitle className="text-base">
                          {devices.name}
                        </CardTitle>
                        <div className="text-sm text-muted-foreground">
                          {devices.type}{" "}
                          {devices.applianceName &&
                            ` - ${devices.applianceName}`}
                        </div>
                      </div>
                    </div>
                    {getStatusIcon("running")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-sm">
                      <span className="font-medium">Interfaces:</span>{" "}
                      {devices.interfaces.length}
                    </div>
                    {devices.interfaces.map((iface) => (
                      <div className="space-y-2">
                        <Card className="text-sm p-2 gap-2 flex flex-row justify-between">
                          <div className="flex flex-col items-end">
                            <span className="font-medium">Interface</span>
                            <span className="text-muted-foreground">
                              {iface.name}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium">IP Address</span>
                            <span className="text-muted-foreground">
                              {iface.ipAddress ?? "not specified"}
                            </span>
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="font-medium">Subnet Mask</span>
                            <span className="text-muted-foreground">
                              {iface.subnet ?? "not specified"}
                            </span>
                          </div>
                        </Card>
                        <div className="text-sm"></div>
                      </div>
                    ))}
                    {devices.credentials && (
                      <div className="text-sm">
                        <span className="font-medium">Login:</span>{" "}
                        {devices.credentials.username} /{" "}
                        {devices.credentials.password}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
        <TabsContent value="console" className="space-y-4">
          {isRunning && (
            <Card>
              <CardHeader>
                <CardTitle>Web Console</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p>
                  Start accessing gns3 web instance via clicking the link
                  below...
                </p>
                <NavLink
                  to={"https://localhost:3080"}
                  target="_blank"
                  className="flex flex-row gap-2.5 text-accent-foreground border-1 rounded-xl w-fit p-2 hover:bg-blue-100/40"
                >
                  <IconWorld />
                  Open lab instance
                </NavLink>
              </CardContent>
            </Card>
          )}
          <Card>
            <CardHeader>
              <CardTitle>Lab Console</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-black text-green-400 p-4 rounded font-mono text-sm min-h-[300px]">
                <div className="mb-2">Lab Environment Console</div>
                <div className="mb-2">Type 'help' for available commands</div>
                <div className="mb-4">---</div>
                {!isRunning ? (
                  <div className="text-yellow-400">
                    Lab environment is not running. Please launch the lab first.
                  </div>
                ) : (
                  <div>
                    <div>lab@environment:~$ status</div>
                    <div>
                      All devices are running and ready for configuration.
                    </div>
                    <div>lab@environment:~$ _</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        {/* LOGS */}
        <TabsContent value="logs" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Container Logs</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="bg-black text-green-400 font-mono text-xs p-4 rounded min-h-[300px] max-h-[600px] overflow-x-auto border border-gray-700">
                {logs.length === 0 ? (
                  <div className="text-yellow-400">
                    No logs yet. Start a lab instance to see logs.
                  </div>
                ) : (
                  <pre>
                    {logs.map((log, idx) => (
                      <div key={idx}>{log}</div>
                    ))}
                  </pre>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {!isRunning && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            The lab environment is currently stopped. Click "Launch Lab" to
            start all devices and begin the exercise.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}
