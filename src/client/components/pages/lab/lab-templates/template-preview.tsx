"use client";
import {
  X,
  Clock,
  Users,
  Star,
  Target,
  BookOpen,
  Wrench,
  FileText,
} from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Separator } from "@clnt/components/ui/separator";
import type { LabTemplate } from "@clnt/types/lab-template";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@clnt/components/ui/drawer";

interface TemplatePreviewProps {
  template: LabTemplate | null;
  isOpen: boolean;
  onClose: () => void;
  onUseTemplate: (template: LabTemplate) => void;
}

export function TemplatePreview({
  template,
  isOpen,
  onClose,
  onUseTemplate,
}: TemplatePreviewProps) {
  if (!template) return null;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const TopologyVisualization = () => (
    <div className="relative bg-gray-50 rounded-lg p-6 min-h-[300px]">
      <svg width="100%" height="300" viewBox="0 0 800 300">
        {/* Render topology nodes */}
        {template.environment.topology.nodes.map((node) => (
          <g key={node.id}>
            <circle
              cx={node.x}
              cy={node.y}
              r="20"
              fill={
                node.type === "router"
                  ? "#3b82f6"
                  : node.type === "switch"
                    ? "#10b981"
                    : "#6b7280"
              }
              className="opacity-80"
            />
            <text
              x={node.x}
              y={node.y + 35}
              textAnchor="middle"
              className="text-xs font-medium"
            >
              {node.name}
            </text>
          </g>
        ))}

        {/* Render topology links */}
        {template.environment.topology.links.map((link) => {
          const sourceNode = template.environment.topology.nodes.find(
            (n) => n.id === link.source,
          );
          const targetNode = template.environment.topology.nodes.find(
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
              stroke="#6b7280"
              strokeWidth="2"
              className="opacity-60"
            />
          );
        })}
      </svg>
    </div>
  );

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-w-full px-10">
        <div className="max-h-screen overflow-y-auto">
          <DrawerHeader className="-mx-4">
            <div className="flex items-start justify-between">
              <div>
                <DrawerTitle className="text-2xl mb-2">
                  {template.title}
                </DrawerTitle>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <Badge className={getDifficultyColor(template.difficulty)}>
                    {template.difficulty}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {template.estimatedTime} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {template.usageCount} uses
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4" />
                    4.5 rating
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="space-y-6">
            {/* Description */}
            <div>
              <p className="text-muted-foreground">{template.description}</p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {template.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="topology">Topology</TabsTrigger>
                <TabsTrigger value="guide">Lab Guide</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="variables">Variables</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Learning Objectives */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Learning Objectives
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {template.objectives.map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{objective}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>

                  {/* Prerequisites */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Prerequisites
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {template.prerequisites.map((prerequisite, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            <span className="text-sm">{prerequisite}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* Devices Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Wrench className="h-5 w-5" />
                      Lab Devices
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {template.environment.topology.nodes.map((device) => (
                        <div key={device.id} className="border rounded-lg p-3">
                          <h4 className="font-medium mb-2">{device.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">
                            {device.type}
                          </p>
                          <div className="text-xs space-y-1">
                            <div>Interfaces: {device.interfaces.length}</div>
                            {/* {device.interfaces.mapipAddress && (
                              <div>IP: {device.ipAddress}</div>
                            )} */}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="topology">
                <Card>
                  <CardHeader>
                    <CardTitle>Network Topology</CardTitle>
                    <CardDescription>
                      Visual representation of the lab network topology
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TopologyVisualization />
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full opacity-80" />
                        <span>Router</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-green-500 rounded-full opacity-80" />
                        <span>Switch</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-gray-500 rounded-full opacity-80" />
                        <span>PC/Server</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-0.5 bg-gray-500 opacity-60" />
                        <span>Connection</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="guide">
                <Card>
                  <CardHeader>
                    <CardTitle>Lab Guide Structure</CardTitle>
                    <CardDescription>
                      Overview of the lab sections and activities
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {template.guide.sections.map((section, index) => (
                        <div key={section.id} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">
                              {index + 1}. {section.title}
                            </h4>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-4 w-4" />
                              {section.estimatedTime}min
                            </div>
                          </div>
                          <Badge variant="outline" className="mb-2">
                            {section.type}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            {section.content.length > 0 && (
                              <div>
                                Content blocks: {section.content.length}
                              </div>
                            )}
                            {section.tasks.length > 0 && (
                              <div>Tasks: {section.tasks.length}</div>
                            )}
                            {section.verification.length > 0 && (
                              <div>
                                Verification steps:{" "}
                                {section.verification.length}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="resources">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Lab Resources
                    </CardTitle>
                    <CardDescription>
                      Additional materials and references for this lab
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {template.resources.map((resource) => (
                        <div
                          key={resource.id}
                          className="flex items-center justify-between p-3 border rounded-lg"
                        >
                          <div>
                            <h4 className="font-medium">{resource.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {resource.description}
                            </p>
                          </div>
                          <Badge variant="outline">
                            {resource.type.replace("_", " ")}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="variables">
                <Card>
                  <CardHeader>
                    <CardTitle>Template Variables</CardTitle>
                    <CardDescription>
                      Customizable parameters for this template
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {template.variables.map((variable) => (
                        <div
                          key={variable.name}
                          className="border rounded-lg p-4"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{variable.name}</h4>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{variable.type}</Badge>
                              {variable.required && (
                                <Badge variant="destructive">Required</Badge>
                              )}
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {variable.description}
                          </p>
                          <div className="text-sm">
                            <span className="font-medium">Default: </span>
                            <code className="bg-gray-100 px-2 py-1 rounded">
                              {variable.defaultValue}
                            </code>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <Separator />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 mb-5">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onUseTemplate(template)}>
                Use This Template
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
