"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Textarea } from "@clnt/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { Switch } from "@clnt/components/ui/switch";
import { Badge } from "@clnt/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@clnt/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@clnt/components/ui/dropdown-menu";
import {
  Plus,
  FileText,
  Video,
  Link,
  Download,
  PenToolIcon as Tool,
  Edit,
  Trash2,
  MoreHorizontal,
  ExternalLink,
} from "lucide-react";
import type {
  ProjectResource,
  ProjectContent,
} from "@clnt/types/project-content";

interface ResourcesManagerProps {
  project: ProjectContent;
  onUpdate: (updates: Partial<ProjectContent>) => void;
}

export function ResourcesManager({ project, onUpdate }: ResourcesManagerProps) {
  const [isAddingResource, setIsAddingResource] = useState(false);
  const [editingResource, setEditingResource] =
    useState<ProjectResource | null>(null);
  const [newResource, setNewResource] = useState<Partial<ProjectResource>>({
    title: "",
    type: "DOCUMENT",
    url: "",
    description: "",
    isRequired: false,
  });

  const addResource = () => {
    if (!newResource.title || !newResource.url) return;

    const resource: ProjectResource = {
      id: `resource_${Date.now()}`,
      title: newResource.title,
      type: newResource.type as ProjectResource["type"],
      url: newResource.url,
      description: newResource.description || "",
      isRequired: newResource.isRequired || false,
    };

    onUpdate({
      resources: [...project.resources, resource],
    });

    setNewResource({
      title: "",
      type: "DOCUMENT",
      url: "",
      description: "",
      isRequired: false,
    });
    setIsAddingResource(false);
  };

  const updateResource = (
    resourceId: string,
    updates: Partial<ProjectResource>,
  ) => {
    onUpdate({
      resources: project.resources.map((resource) =>
        resource.id === resourceId ? { ...resource, ...updates } : resource,
      ),
    });
    setEditingResource(null);
  };

  const deleteResource = (resourceId: string) => {
    onUpdate({
      resources: project.resources.filter(
        (resource) => resource.id !== resourceId,
      ),
    });
  };

  const getResourceIcon = (type: ProjectResource["type"]) => {
    const icons = {
      DOCUMENT: FileText,
      VIDEO: Video,
      LINK: Link,
      DOWNLOAD: Download,
      TOOL: Tool,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getResourceColor = (type: ProjectResource["type"]) => {
    const colors = {
      DOCUMENT: "bg-blue-100 text-blue-800",
      VIDEO: "bg-red-100 text-red-800",
      LINK: "bg-green-100 text-green-800",
      DOWNLOAD: "bg-purple-100 text-purple-800",
      TOOL: "bg-yellow-100 text-yellow-800",
    };
    return colors[type];
  };

  const renderResourceForm = (
    resource: Partial<ProjectResource>,
    onSave: () => void,
    onCancel: () => void,
  ) => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {resource.id ? "Edit Resource" : "Add New Resource"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Resource Title</Label>
              <Input
                value={resource.title || ""}
                onChange={(e) => {
                  if (resource.id) {
                    setEditingResource({
                      ...editingResource!,
                      title: e.target.value,
                    });
                  } else {
                    setNewResource({ ...newResource, title: e.target.value });
                  }
                }}
                placeholder="Enter resource title..."
              />
            </div>
            <div>
              <Label>Resource Type</Label>
              <Select
                value={resource.type || "DOCUMENT"}
                onValueChange={(value) => {
                  if (resource.id) {
                    setEditingResource({
                      ...editingResource!,
                      type: value as ProjectResource["type"],
                    });
                  } else {
                    setNewResource({
                      ...newResource,
                      type: value as ProjectResource["type"],
                    });
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DOCUMENT">Document</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                  <SelectItem value="DOWNLOAD">Download</SelectItem>
                  <SelectItem value="TOOL">Tool</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label>URL</Label>
            <Input
              value={resource.url || ""}
              onChange={(e) => {
                if (resource.id) {
                  setEditingResource({
                    ...editingResource!,
                    url: e.target.value,
                  });
                } else {
                  setNewResource({ ...newResource, url: e.target.value });
                }
              }}
              placeholder="Enter resource URL..."
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              value={resource.description || ""}
              onChange={(e) => {
                if (resource.id) {
                  setEditingResource({
                    ...editingResource!,
                    description: e.target.value,
                  });
                } else {
                  setNewResource({
                    ...newResource,
                    description: e.target.value,
                  });
                }
              }}
              placeholder="Describe this resource and how it helps students..."
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              checked={resource.isRequired || false}
              onCheckedChange={(checked) => {
                if (resource.id) {
                  setEditingResource({
                    ...editingResource!,
                    isRequired: checked,
                  });
                } else {
                  setNewResource({ ...newResource, isRequired: checked });
                }
              }}
            />
            <Label>Required resource</Label>
          </div>

          <div className="flex gap-2">
            <Button onClick={onSave}>
              {resource.id ? "Update Resource" : "Add Resource"}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Project Resources</h2>
          <p className="text-muted-foreground">
            Add helpful resources and tools for students
          </p>
        </div>
        <Button onClick={() => setIsAddingResource(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Resource
        </Button>
      </div>

      {isAddingResource &&
        renderResourceForm(newResource, addResource, () =>
          setIsAddingResource(false),
        )}

      {editingResource &&
        renderResourceForm(
          editingResource,
          () => updateResource(editingResource.id, editingResource),
          () => setEditingResource(null),
        )}

      <Card>
        <CardHeader>
          <CardTitle>Resources ({project.resources.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {project.resources.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <h3 className="text-lg font-medium mb-2">
                No resources added yet
              </h3>
              <p className="text-muted-foreground mb-4">
                Add helpful resources like documentation, videos, tools, and
                downloads
              </p>
              <Button onClick={() => setIsAddingResource(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First Resource
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Resource</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Required</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {project.resources.map((resource) => (
                  <TableRow key={resource.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {getResourceIcon(resource.type)}
                        <div>
                          <div className="font-medium">{resource.title}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />
                            {resource.url}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getResourceColor(resource.type)}>
                        {resource.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate text-muted-foreground">
                        {resource.description || "No description"}
                      </div>
                    </TableCell>
                    <TableCell>
                      {resource.isRequired ? (
                        <Badge variant="default">Required</Badge>
                      ) : (
                        <Badge variant="outline">Optional</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => setEditingResource(resource)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => window.open(resource.url, "_blank")}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open Link
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteResource(resource.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
