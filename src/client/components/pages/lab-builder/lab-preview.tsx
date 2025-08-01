"use client";

import React from "react";
import { Button } from "@clnt/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerPortal,
  DrawerTitle,
} from "@clnt/components/ui/drawer";
import { Badge } from "@clnt/components/ui/badge";
import { ScrollArea } from "@clnt/components/ui/scroll-area";
import { Separator } from "@clnt/components/ui/separator";
import {
  Clock,
  Target,
  BookOpen,
  Play,
  Edit,
  Network,
  FileText,
  CheckSquare,
  AlertTriangle,
  Router,
  Monitor,
  Server,
  BrickWallFire,
  Cog,
} from "lucide-react";
import { IconCloud } from "@tabler/icons-react";
import type { Lab, TopologyNode } from "@clnt/types/lab";
import { Card } from "@clnt/components/ui/card";
import { cn } from "@clnt/lib/utils";

interface LabPreviewProps {
  lab: Lab | null;
  isOpen: boolean;
  onClose: () => void;
  onLaunchLab?: (lab: Lab) => void;
  onEditLab?: (lab: Lab) => void;
}

export function LabPreview({
  lab,
  isOpen,
  onClose,
  onLaunchLab,
  onEditLab,
}: LabPreviewProps) {
  if (!lab) return null;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return (
      colors[difficulty as keyof typeof colors] || "bg-gray-100 text-gray-800"
    );
  };

  const getdevicesColor = (type: string) => {
    const colors = {
      router: "text-blue-700",
      switch: "text-green-600",
      pc: "text-gray-700",
      server: "text-amber-700",
      firewall: "text-red-900",
      cloud: "text-cyan-600",
    };
    return colors[type as keyof typeof colors] || "text-blue-700";
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

  const renderTopology = () => {
    const nodes = lab.environment.topology?.nodes ?? [];
    const notes = lab.environment.topology?.notes ?? [];
    const links = lab.environment.topology?.links ?? [];

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

  const getSectionIcon = (type: string) => {
    const icons = {
      introduction: BookOpen,
      step: Target,
      verification: CheckSquare,
      troubleshooting: AlertTriangle,
      summary: CheckSquare,
    };
    const Icon = icons[type as keyof typeof icons] || BookOpen;
    return <Icon className="h-4 w-4" />;
  };
  const totalTasks = (lab.guide?.sections ?? []).reduce(
    (total, section) => total + (section.tasks?.length ?? 0),
    0,
  );

  const totalVerifications = (lab.guide?.sections ?? []).reduce(
    (total, section) => total + (section.verifications?.length ?? 0),
    0,
  );

  const grouped = lab.environment.topology.nodes.reduce<
    Record<string, TopologyNode[]>
  >((acc, device) => {
    if (!acc[device.type]) acc[device.type] = [];
    acc[device.type].push(device);
    return acc;
  }, {});

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerPortal>
        <DrawerContent>
          <ScrollArea className="-mt-7 rounded-t-lg max-h-screen overflow-y-auto">
            <div className="relative">
              <div className="w-full h-48 object-cover bg-gradient-to-r from-blue-500 to-purple-600" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6 text-white">
                <DrawerTitle className="text-3xl font-bold text-white">
                  {lab.title}
                </DrawerTitle>
                <DrawerDescription className="mt-2 text-gray-200">
                  {lab.description}
                </DrawerDescription>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex flex-wrap items-center gap-4 text-sm">
                <Badge className={getDifficultyColor(lab.difficulty)}>
                  {lab.difficulty}
                </Badge>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  {lab.estimatedTime} minutes
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <Target className="h-4 w-4" />
                  {lab.objectives?.length ?? 0} objectives
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <CheckSquare className="h-4 w-4" />
                  {totalTasks} tasks
                </div>
                <div className="flex items-center gap-1 text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  {lab.resources?.length ?? 0} resources
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">{lab.category}</Badge>
                {lab.tags?.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </h3>
                <ul className="space-y-2">
                  {lab.objectives?.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                      {objective}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Prerequisites
                </h3>
                <ul className="space-y-2">
                  {lab.prerequisites?.map((prerequisite, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                      {prerequisite}
                    </li>
                  ))}
                </ul>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Network className="h-5 w-5" />
                  Lab Environment
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Environment Type</p>
                    <p className="font-medium">{lab.environment.type}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Network Nodes</p>
                    <p className="font-medium">
                      {lab.environment.topology?.nodes?.length ?? 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Network Links</p>
                    <p className="font-medium">
                      {lab.environment.topology?.links?.length ?? 0}
                    </p>
                  </div>
                </div>

                {lab.environment?.topology.nodes?.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-10">
                    <div className="col-span-1">
                      <h4 className="font-medium mb-2">Network Topology</h4>
                      {renderTopology()}
                    </div>
                    <div className="col-span-1">
                      <h4 className="font-medium mb-2">Devices Overview</h4>
                      <div className="space-y-4">
                        {Object.entries(grouped).map(([type, devices]) => (
                          <div key={type}>
                            <h4 className="text-sm font-semibold capitalize mb-1">
                              {type}
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                              {devices.slice(0, 6).map((device) => (
                                <Card
                                  key={device.id}
                                  className="flex flex-row items-center justify-center gap-5 p-2 rounded text-sm"
                                >
                                  <div>{getdevicesIcon(device.type)}</div>
                                  <div className="flex flex-col">
                                    <span className="font-medium">
                                      {device.name}
                                    </span>
                                    {device.applianceName && (
                                      <span className="text-muted-foreground">
                                        {device.applianceName}
                                      </span>
                                    )}
                                  </div>
                                </Card>
                              ))}
                              {devices.length > 6 && (
                                <div className="text-sm text-muted-foreground p-2">
                                  +{devices.length - 6} more {type}…
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Lab Guide ({lab.guide?.sections?.length ?? 0} sections)
                </h3>
                <div className="space-y-3">
                  {lab.guide?.sections?.map((section, index) => (
                    <div key={section.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getSectionIcon(section.type)}
                          <span className="font-medium">
                            {index + 1}. {section.title}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {section.type}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {section.estimatedTime}min
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mt-3">
                        <div>
                          <span className="text-muted-foreground">
                            Content Items:
                          </span>
                          <span className="ml-1 font-medium">
                            {section.content?.length ?? 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Tasks:</span>
                          <span className="ml-1 font-medium">
                            {section.tasks?.length ?? 0}
                          </span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">
                            Verifications:
                          </span>
                          <span className="ml-1 font-medium">
                            {section.verifications?.length ?? 0}
                          </span>
                        </div>
                      </div>

                      {section.hints?.length > 0 && (
                        <div className="mt-2 text-sm text-muted-foreground">
                          <span>Hints available: {section.hints.length}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Lab Resources ({lab.resources?.length ?? 0})
                </h3>
                {lab.resources?.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {lab.resources.map((resource) => (
                      <div
                        key={resource.id}
                        className="flex items-center justify-between p-3 border rounded"
                      >
                        <div>
                          <p className="font-medium text-sm">
                            {resource.title}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {resource.description}
                          </p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {resource.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    No additional resources provided
                  </p>
                )}
              </div>

              <Separator />
              {/* Lab Settings Review */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Cog className="w-5 h-5" />
                  Lab Settings
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-muted-foreground">
                      Max Submission Attempts
                    </span>
                    <p className="font-medium">
                      {lab.settings.maxAttemptSubmission}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">
                      Force Exit Upon Timeout
                    </span>
                    <p className="font-medium">
                      {lab.settings.onForceExitUponTimeout
                        ? "Enabled"
                        : "Disabled"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">
                      Interactive Lab
                    </span>
                    <p className="font-medium">
                      {lab.settings.disableInteractiveLab
                        ? "Disabled"
                        : "Enabled"}
                    </p>
                  </div>

                  <div>
                    <span className="text-muted-foreground">
                      Strictly no late submission
                    </span>
                    <p className="font-medium">
                      {lab.settings.noLateSubmission ? "Disabled" : "Enabled"}
                    </p>
                  </div>
                </div>
              </div>
              <Separator />

              <div>
                <h3 className="text-lg font-semibold mb-3">Lab Statistics</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="p-3 bg-blue-50 rounded">
                    <div className="text-2xl font-bold text-blue-600">
                      {lab.guide?.sections?.length ?? 0}
                    </div>
                    <div className="text-sm text-blue-600">Sections</div>
                  </div>
                  <div className="p-3 bg-green-50 rounded">
                    <div className="text-2xl font-bold text-green-600">
                      {totalTasks}
                    </div>
                    <div className="text-sm text-green-600">Tasks</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded">
                    <div className="text-2xl font-bold text-purple-600">
                      {totalVerifications}
                    </div>
                    <div className="text-sm text-purple-600">Verifications</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded">
                    <div className="text-2xl font-bold text-orange-600">
                      {lab.estimatedTime}
                    </div>
                    <div className="text-sm text-orange-600">Minutes</div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button variant="outline" onClick={onClose}>
                  Close Preview
                </Button>
                {onEditLab && (
                  <Button variant="outline" onClick={() => onEditLab(lab)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Lab
                  </Button>
                )}
                {onLaunchLab && (
                  <Button onClick={() => onLaunchLab(lab)}>
                    <Play className="h-4 w-4 mr-2" />
                    Launch Lab
                  </Button>
                )}
              </div>
            </div>
          </ScrollArea>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
