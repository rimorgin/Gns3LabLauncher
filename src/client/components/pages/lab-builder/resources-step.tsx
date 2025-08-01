"use client";

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
import { Plus, Trash2, FileText } from "lucide-react";
import type { LabResource } from "@clnt/types/lab";
import { useImmer } from "use-immer";

interface ResourcesStepProps {
  data: LabResource[];
  onUpdate: (data: LabResource[]) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function ResourcesStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: ResourcesStepProps) {
  const [resources, setResources] = useImmer<LabResource[]>(data || []);

  const handleNext = () => {
    onUpdate(resources); // send updated state
    onNext();
  };

  const handlePrev = () => {
    onUpdate(resources);
    onPrev();
  };

  const addResource = () => {
    setResources((draft) => {
      draft.push({
        id: crypto.randomUUID(),
        title: "",
        type: "documentation",
        url: "",
        description: "",
      });
    });
  };

  const updateResource = <K extends keyof LabResource>(
    index: number,
    field: K,
    value: LabResource[K],
  ) => {
    setResources((draft) => {
      draft[index][field] = value;
    });
  };

  const removeResource = (index: number) => {
    setResources((draft) => {
      draft.splice(index, 1);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Lab Resources
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">Additional Resources</h3>
            <p className="text-sm text-gray-600">
              Add documentation, references, and downloadable materials
            </p>
          </div>
          <Button onClick={addResource} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Resource
          </Button>
        </div>

        <div className="space-y-4">
          {(resources ?? []).map((resource, index) => (
            <Card key={`${resource.id}`} className="p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="font-medium">Resource {index + 1}</h4>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeResource(index)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Resource Title</Label>
                  <Input
                    value={resource.title}
                    onChange={(e) =>
                      updateResource(index, "title", e.target.value)
                    }
                    placeholder="Enter resource title"
                  />
                </div>

                <div>
                  <Label>Resource Type</Label>
                  <Select
                    value={resource.type}
                    onValueChange={(value: LabResource["type"]) =>
                      updateResource(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="documentation">
                        Documentation
                      </SelectItem>
                      <SelectItem value="cheat_sheet">Cheat Sheet</SelectItem>
                      <SelectItem value="reference">Reference</SelectItem>
                      <SelectItem value="download">Download</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label>URL</Label>
                  <Input
                    value={resource.url}
                    onChange={(e) =>
                      updateResource(index, "url", e.target.value)
                    }
                    placeholder="https://example.com/resource"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label>Description</Label>
                  <Textarea
                    value={resource.description}
                    onChange={(e) =>
                      updateResource(index, "description", e.target.value)
                    }
                    placeholder="Describe what this resource provides"
                    rows={3}
                  />
                </div>
              </div>
            </Card>
          ))}

          {resources.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No resources added yet</p>
              <p className="text-sm">
                Click "Add Resource" to include helpful materials for your lab
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrev}>
            Previous: Lab Guide
          </Button>
          <Button onClick={handleNext}>Next: Settings</Button>
        </div>
      </CardContent>
    </Card>
  );
}
