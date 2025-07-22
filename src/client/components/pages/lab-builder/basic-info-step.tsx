"use client";

import {
  Card,
  CardContent,
  CardDescription,
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
import { Badge } from "@clnt/components/ui/badge";
import { X, Plus } from "lucide-react";
import type { Lab } from "@clnt/types/lab";
import { useImmer } from "use-immer";
import { useState } from "react";

interface BasicInfoStepProps {
  data: Partial<Lab>;
  onUpdate: (data: Partial<Lab>) => void;
  onNext: () => void;
}

export const BasicInfoStep = ({
  data,
  onUpdate,
  onNext,
}: BasicInfoStepProps) => {
  const [formData, updateFormData] = useImmer({
    ...(data.id && { id: data.id }),
    title: data.title || "",
    description: data.description || "",
    difficulty: data.difficulty || "BEGINNER",
    estimatedTime: data.estimatedTime || 60,
    category: data.category || "",
    tags: data.tags || [],
    objectives: data.objectives || [],
    prerequisites: data.prerequisites || [],
  });

  const [newTag, setNewTag] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");

  const isValid =
    formData.title.trim() &&
    formData.description.trim() &&
    formData.category.trim();

  const handleNext = () => {
    onUpdate(formData);
    onNext();
  };

  const handleInputChange = (
    field: keyof typeof formData,
    value: string | number,
  ) => {
    updateFormData((d) => {
      //@ts-expect-error expecting never
      d[field] = value;
    });
  };

  const handleAddItem = (
    list: keyof typeof formData,
    value: string,
    reset: () => void,
  ) => {
    if (value.trim()) {
      updateFormData((d) => {
        (d[list] as string[]).push(value.trim());
      });
      reset();
    }
  };

  const handleRemoveItem = (list: keyof typeof formData, index: number) => {
    updateFormData((d) => {
      (d[list] as string[]).splice(index, 1);
    });
  };

  const handleRemoveTag = (tag: string) => {
    console.log("this clicked");
    updateFormData((d) => {
      const idx = d.tags.findIndex((t) => t === tag);
      if (idx !== -1) d.tags.splice(idx, 1);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Lab Information</CardTitle>
        <CardDescription>{data.id}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Title & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="title">Lab Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter lab title"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category *</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => handleInputChange("category", e.target.value)}
              placeholder="e.g., Routing, Switching, Security"
            />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description *</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => handleInputChange("description", e.target.value)}
            placeholder="Describe what students will learn in this lab"
            rows={3}
          />
        </div>

        {/* Difficulty & Time */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Difficulty Level</Label>
            <Select
              value={formData.difficulty}
              onValueChange={(value) => handleInputChange("difficulty", value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="BEGINNER">Beginner</SelectItem>
                <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
                <SelectItem value="ADVANCED">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
            <Input
              id="estimatedTime"
              type="number"
              value={formData.estimatedTime}
              onChange={(e) =>
                handleInputChange("estimatedTime", Number(e.target.value) || 0)
              }
              min="1"
            />
          </div>
        </div>

        {/* Tags */}
        <div className="space-y-2">
          <Label>Tags</Label>
          <div className="flex flex-wrap gap-2 mb-2">
            {formData.tags.map((tag) => (
              <Badge
                key={tag}
                variant="secondary"
                className="flex items-center gap-1 pl-5"
              >
                {tag}
                <Button
                  variant="ghost"
                  className="p-0 m-0 cursor-pointer"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleAddItem("tags", newTag, () => setNewTag(""))
              }
            />
            <Button
              type="button"
              onClick={() => handleAddItem("tags", newTag, () => setNewTag(""))}
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Objectives */}
        <div className="space-y-2">
          <Label>Learning Objectives</Label>
          <div className="space-y-2">
            {formData.objectives.map((objective, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  className="w-full"
                  value={objective}
                  onChange={(e) => {
                    updateFormData((d) => {
                      d.objectives[index] = e.target.value;
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("objectives", index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Add a learning objective"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddItem("objectives", newObjective, () =>
                    setNewObjective(""),
                  );
                }
              }}
            />
            <Button
              type="button"
              onClick={() =>
                handleAddItem("objectives", newObjective, () =>
                  setNewObjective(""),
                )
              }
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Prerequisites */}
        <div className="space-y-2">
          <Label>Prerequisites</Label>
          <div className="space-y-2">
            {formData.prerequisites.map((prerequisite, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  className="w-full"
                  value={prerequisite}
                  onChange={(e) => {
                    updateFormData((d) => {
                      d.prerequisites[index] = e.target.value;
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleRemoveItem("prerequisites", index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              placeholder="Add a prerequisite"
              onKeyDown={(e) =>
                e.key === "Enter" &&
                handleAddItem("prerequisites", newPrerequisite, () =>
                  setNewPrerequisite(""),
                )
              }
            />
            <Button
              type="button"
              onClick={() =>
                handleAddItem("prerequisites", newPrerequisite, () =>
                  setNewPrerequisite(""),
                )
              }
              size="sm"
            >
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleNext} disabled={!isValid}>
            Next: Environment Setup
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
