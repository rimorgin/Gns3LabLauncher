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
  RotateCcw,
  Monitor,
  Network,
  Server,
  Wifi,
  Router,
  Activity,
  CheckCircle,
  AlertCircle,
  Clock,
  BrickWallFire,
} from "lucide-react";
import type { LabDevice, LabEnvironment } from "@clnt/types/lab";
import socket from "@clnt/lib/socket";
import { IconWorld } from "@tabler/icons-react";
import { NavLink } from "react-router";

interface LabEnvironmentProps {
  environment: LabEnvironment;
  onLaunch: () => void;
  onStop: () => void;
  onReset: () => void;
  isRunning: boolean;
  isLoading: boolean;
}

export function LabEnvironmentComponent({
  environment,
  onLaunch,
  onStop,
  onReset,
  isRunning,
  isLoading,
}: LabEnvironmentProps) {
  const [selectedDevices, setSelectedDevices] = useState<LabDevice | null>(
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

  const getdevicesIcon = (type: string) => {
    const icons = {
      router: Router,
      switch: Network,
      pc: Monitor,
      server: Server,
      firewall: BrickWallFire,
      cloud: Wifi,
    };
    const Icon = icons[type as keyof typeof icons] || Monitor;
    return <Icon className="h-6 w-6" />;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      running: "bg-green-500",
      stopped: "bg-red-500",
      starting: "bg-yellow-500",
      error: "bg-red-600",
      up: "bg-green-500",
      down: "bg-red-500",
      "admin-down": "bg-gray-500",
    };
    return colors[status as keyof typeof colors] || "bg-gray-400";
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
    return (
      <div className="relative bg-gray-50 rounded-lg p-6 min-h-[400px] border-2 border-dashed border-gray-200">
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            width={environment.topology.layout.width || 600}
            height={environment.topology.layout.height || 400}
            className="border rounded"
          >
            {/* Render links first (behind nodes) */}
            {environment.topology.links.map((link) => {
              const sourceNode = environment.topology.nodes.find(
                (n) => n.id === link.source,
              );
              const targetNode = environment.topology.nodes.find(
                (n) => n.id === link.target,
              );
              if (!sourceNode || !targetNode) return null;

              return (
                <line
                  key={link.id}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={link.status === "up" ? "#10b981" : "#ef4444"}
                  strokeWidth="2"
                  strokeDasharray={link.status === "down" ? "5,5" : "none"}
                />
              );
            })}

            {/* Render nodes */}
            {environment.topology.nodes.map((node) => (
              <g key={node.id}>
                <circle
                  cx={node.x}
                  cy={node.y}
                  r="25"
                  fill="white"
                  stroke={node.status === "running" ? "#10b981" : "#ef4444"}
                  strokeWidth="3"
                  className="cursor-pointer hover:stroke-blue-500"
                  onClick={() => {
                    const devices = environment.devices.find(
                      (d) => d.name === node.name,
                    );
                    if (devices) setSelectedDevices(devices);
                  }}
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
                  {environment.devices.length} devices •{" "}
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
                  <Button variant="outline" onClick={onReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                  <Button variant="destructive" onClick={onStop}>
                    <Square className="h-4 w-4 mr-2" />
                    Stop Lab
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
          <div className="grid md:grid-cols-2 gap-4">
            {environment.devices.map((devices) => (
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
                          {devices.type}
                        </div>
                      </div>
                    </div>
                    {getStatusIcon("running")}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {devices.ipAddress && (
                      <div className="text-sm">
                        <span className="font-medium">IP:</span>{" "}
                        {devices.ipAddress}
                      </div>
                    )}
                    {devices.credentials && (
                      <div className="text-sm">
                        <span className="font-medium">Login:</span>{" "}
                        {devices.credentials.username} /{" "}
                        {devices.credentials.password}
                      </div>
                    )}
                    <div className="text-sm">
                      <span className="font-medium">Interfaces:</span>{" "}
                      {devices.interfaces.length}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedDevices && (
            <Card>
              <CardHeader>
                <CardTitle>devices Details: {selectedDevices.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {selectedDevices.type}
                    </div>
                    <div>
                      <span className="font-medium">IP Address:</span>{" "}
                      {selectedDevices.ipAddress || "N/A"}
                    </div>
                  </div>

                  {selectedDevices.credentials && (
                    <div>
                      <h4 className="font-medium mb-2">Credentials</h4>
                      <div className="bg-muted p-3 rounded font-mono text-sm">
                        Username: {selectedDevices.credentials.username}
                        <br />
                        Password: {selectedDevices.credentials.password}
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-medium mb-2">Interfaces</h4>
                    <div className="space-y-2">
                      {selectedDevices.interfaces.map((iface, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <span className="font-medium">{iface.name}</span>
                            {iface.ipAddress && (
                              <span className="ml-2 text-muted-foreground">
                                {iface.ipAddress}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-2 h-2 rounded-full ${getStatusColor(iface.status ?? "down")}`}
                            />
                            <span className="text-sm">{iface.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
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
              <div className="bg-black text-green-400 p-4 rounded font-mono text-xs min-h-[300px] max-h-[400px] overflow-y-auto">
                {logs.length === 0 ? (
                  <div className="text-gray-400">
                    No logs yet. Start a container to see logs.
                  </div>
                ) : (
                  logs.map((log, idx) => (
                    <div key={idx} className="whitespace-pre-wrap">
                      {log}
                    </div>
                  ))
                )}
              </div>
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
