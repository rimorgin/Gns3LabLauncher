"use client";

import { Textarea } from "@clnt/components/ui/textarea";

import type React from "react";

import type { LabTemplate, LabResource } from "@clnt/types/lab-template";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Button } from "@clnt/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@clnt/components/ui/card";

interface TemplateResourcesEditorProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateResourcesEditor({
  template,
  setTemplate,
}: TemplateResourcesEditorProps) {
  const [newResource, setNewResource] = useState<LabResource>({
    id: "",
    title: "", // Changed from name
    type: "documentation", // Updated default type
    url: "",
    description: "",
  });

  const handleResourceChange = (
    index: number,
    field: keyof LabResource,
    value: string,
  ) => {
    const updatedResources = template.resources.map(
      (
        resource,
        i, // Changed from resourceTemplates
      ) => (i === index ? { ...resource, [field]: value } : resource),
    );
    setTemplate((prev) => ({ ...prev, resources: updatedResources })); // Changed from resourceTemplates
  };

  const handleNewResourceChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewResource((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewResourceTypeChange = (value: LabResource["type"]) => {
    setNewResource((prev) => ({ ...prev, type: value }));
  };

  const addResource = () => {
    if (newResource.title && newResource.url) {
      // Changed from name
      setTemplate((prev) => ({
        ...prev,
        resources: [
          ...prev.resources,
          { ...newResource, id: `res-${Date.now()}` },
        ], // Changed from resourceTemplates
      }));
      setNewResource({
        id: "",
        title: "", // Changed from name
        type: "documentation", // Updated default type
        url: "",
        description: "",
      });
    }
  };

  const removeResource = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      resources: prev.resources.filter((resource) => resource.id !== id), // Changed from resourceTemplates
    }));
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <Label>Lab Resources</Label>
        <div className="space-y-4">
          {template.resources.map(
            (
              resource,
              index, // Changed from resourceTemplates
            ) => (
              <Card key={resource.id} className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor={`resource-title-${index}`}>Title</Label>{" "}
                    {/* Changed from name */}
                    <Input
                      id={`resource-title-${index}`}
                      value={resource.title} // Changed from name
                      onChange={(e) =>
                        handleResourceChange(index, "title", e.target.value)
                      } // Changed from name
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor={`resource-type-${index}`}>Type</Label>
                    <Select
                      value={resource.type}
                      onValueChange={(value: LabResource["type"]) =>
                        handleResourceChange(index, "type", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="documentation">
                          Documentation
                        </SelectItem>{" "}
                        {/* Updated enum */}
                        <SelectItem value="cheat_sheet">
                          Cheat Sheet
                        </SelectItem>{" "}
                        {/* Updated enum */}
                        <SelectItem value="reference">
                          Reference
                        </SelectItem>{" "}
                        {/* Updated enum */}
                        <SelectItem value="download">Download</SelectItem>{" "}
                        {/* Updated enum */}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2 col-span-full">
                    <Label htmlFor={`resource-url-${index}`}>URL</Label>
                    <Input
                      id={`resource-url-${index}`}
                      value={resource.url}
                      onChange={(e) =>
                        handleResourceChange(index, "url", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-2 mt-4">
                  <Label htmlFor={`resource-description-${index}`}>
                    Description
                  </Label>
                  <Textarea
                    id={`resource-description-${index}`}
                    value={resource.description || ""}
                    onChange={(e) =>
                      handleResourceChange(index, "description", e.target.value)
                    }
                    rows={2}
                  />
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  className="mt-4"
                  onClick={() => removeResource(resource.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" /> Remove Resource
                </Button>
              </Card>
            ),
          )}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Resource</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-resource-title">Title</Label>{" "}
              {/* Changed from name */}
              <Input
                id="new-resource-title"
                name="title" // Changed from name
                value={newResource.title} // Changed from name
                onChange={handleNewResourceChange}
                placeholder="e.g., OSPF Configuration Guide"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-resource-type">Type</Label>
              <Select
                value={newResource.type}
                onValueChange={handleNewResourceTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="documentation">Documentation</SelectItem>{" "}
                  {/* Updated enum */}
                  <SelectItem value="cheat_sheet">Cheat Sheet</SelectItem>{" "}
                  {/* Updated enum */}
                  <SelectItem value="reference">Reference</SelectItem>{" "}
                  {/* Updated enum */}
                  <SelectItem value="download">Download</SelectItem>{" "}
                  {/* Updated enum */}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2 col-span-full">
              <Label htmlFor="new-resource-url">URL</Label>
              <Input
                id="new-resource-url"
                name="url"
                value={newResource.url}
                onChange={handleNewResourceChange}
                placeholder="e.g., https://example.com/ospf-guide.pdf"
              />
            </div>
          </div>
          <div className="grid gap-2 mt-4">
            <Label htmlFor="new-resource-description">Description</Label>
            <Textarea
              id="new-resource-description"
              name="description"
              value={newResource.description || ""}
              onChange={handleNewResourceChange}
              rows={2}
              placeholder="A brief description of the resource."
            />
          </div>
          <Button onClick={addResource} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Resource
          </Button>
        </Card>
      </div>
    </div>
  );
}
