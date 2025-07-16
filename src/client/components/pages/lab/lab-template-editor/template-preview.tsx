"use client";

import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { ScrollArea } from "@clnt/components/ui/scroll-area";
import { Clock, Target, Users, Play } from "lucide-react";
import type { LabTemplate } from "@clnt/types/lab-template";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="sm:max-w-[800px] p-0">
        <ScrollArea className="max-h-[90vh] overflow-y-auto">
          <div className="relative">
            <img
              src={template.thumbnail || "/placeholder.svg"}
              alt={template.title} // Changed from name
              width={800}
              height={300}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <DrawerTitle className="text-3xl font-bold">
                {template.title}
              </DrawerTitle>{" "}
              {/* Changed from name */}
              <DrawerDescription className="mt-2">
                {template.description}
              </DrawerDescription>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <Badge className={getDifficultyColor(template.difficulty)}>
                {template.difficulty}
              </Badge>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {template.estimatedTime} minutes
              </div>
              <div className="flex items-center gap-1">
                <Target className="h-4 w-4" />
                {template.objectives.length} objectives
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {template.usageCount} uses
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Learning Objectives
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {template.objectives.map((obj, index) => (
                  <li key={index}>{obj}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Prerequisites</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {template.prerequisites.map((pre, index) => (
                  <li key={index}>{pre}</li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Lab Environment Overview
              </h3>
              <p className="text-sm text-muted-foreground">
                Type: {template.labEnvironment.type}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Nodes: {template.labEnvironment.topology.nodes.length}, Links:{" "}
                {template.labEnvironment.topology.links.length}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                Devices: {template.labEnvironment.devices.length}
              </p>
              {template.labEnvironment.startupConfig && (
                <p className="text-sm text-muted-foreground mt-1">
                  Startup Config:{" "}
                  {template.labEnvironment.startupConfig.substring(0, 50)}...
                </p>
              )}
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Lab Guide Sections</h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {template.guide.sections.map((section) => (
                  <li key={section.id}>
                    {section.order}. {section.title} ({section.estimatedTime}{" "}
                    min)
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Associated Resources
              </h3>
              <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                {template.resources.map(
                  (
                    resource, // Changed from resourceTemplates
                  ) => (
                    <li key={resource.id}>
                      <a
                        href={resource.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {resource.title} ({resource.type})
                      </a>
                    </li>
                  ),
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Customizable Variables
              </h3>
              {template.variables.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  {template.variables.map((variable, index) => (
                    <li key={index}>
                      <strong>{variable.name}</strong> ({variable.type},
                      Default: {variable.defaultValue}) - {variable.description}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No customizable variables defined for this template.
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button onClick={() => onUseTemplate(template)}>
                <Play className="h-4 w-4 mr-2" /> Use Template
              </Button>
            </div>
          </div>
        </ScrollArea>
      </DrawerContent>
    </Drawer>
  );
}
