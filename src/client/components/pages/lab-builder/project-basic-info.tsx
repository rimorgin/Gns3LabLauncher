"use client";

import type React from "react";

import { useState, useRef } from "react";
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
import { Badge } from "@clnt/components/ui/badge";
import { Upload, X, Plus, Target, Clock, Tag } from "lucide-react";
import type { ProjectContent } from "@clnt/types/project-content";

interface ProjectBasicInfoProps {
  project: ProjectContent;
  onUpdate: (updates: Partial<ProjectContent>) => void;
}

export function ProjectBasicInfo({ project, onUpdate }: ProjectBasicInfoProps) {
  const [newTag, setNewTag] = useState("");
  const [newObjective, setNewObjective] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // In a real app, you'd upload to a file storage service
      const imageUrl = URL.createObjectURL(file);
      onUpdate({ imageUrl });
    }
  };

  const addTag = () => {
    if (newTag.trim() && !project.tags.includes(newTag.trim())) {
      onUpdate({ tags: [...project.tags, newTag.trim()] });
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    onUpdate({ tags: project.tags.filter((tag) => tag !== tagToRemove) });
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      onUpdate({ objectives: [...project.objectives, newObjective.trim()] });
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    onUpdate({ objectives: project.objectives.filter((_, i) => i !== index) });
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      onUpdate({
        prerequisites: [...project.prerequisites, newPrerequisite.trim()],
      });
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    onUpdate({
      prerequisites: project.prerequisites.filter((_, i) => i !== index),
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors];
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <Label htmlFor="project-name">Project Name</Label>
              <Input
                id="project-name"
                value={project.projectName}
                onChange={(e) => onUpdate({ projectName: e.target.value })}
                placeholder="Enter project name..."
              />
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty Level</Label>
              <Select
                value={project.difficulty}
                onValueChange={(value) =>
                  onUpdate({
                    difficulty: value as ProjectContent["difficulty"],
                  })
                }
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

            <div>
              <Label htmlFor="duration">Estimated Duration (hours)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                max="200"
                value={project.estimatedDuration}
                onChange={(e) =>
                  onUpdate({
                    estimatedDuration: Number.parseInt(e.target.value) || 1,
                  })
                }
              />
            </div>

            <div className="col-span-2">
              <Label htmlFor="description">Project Description</Label>
              <Textarea
                id="description"
                value={project.projectDescription}
                onChange={(e) =>
                  onUpdate({ projectDescription: e.target.value })
                }
                placeholder="Describe what students will learn and accomplish..."
                className="min-h-[100px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Image */}
      <Card>
        <CardHeader>
          <CardTitle>Project Image</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {project.imageUrl ? (
              <div className="relative">
                <img
                  src={project.imageUrl || "/placeholder.svg"}
                  alt="Project cover"
                  className="w-full h-48 object-cover rounded-lg border"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => onUpdate({ imageUrl: null })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  Click to upload project image
                </p>
              </div>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
          </div>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Tag className="h-5 w-5" />
            Tags
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === "Enter" && addTag()}
            />
            <Button onClick={addTag}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {project.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1"
                >
                  {tag}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-4 w-4 p-0 hover:bg-transparent"
                    onClick={() => removeTag(tag)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Learning Objectives
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newObjective}
              onChange={(e) => setNewObjective(e.target.value)}
              placeholder="Add a learning objective..."
              onKeyPress={(e) => e.key === "Enter" && addObjective()}
            />
            <Button onClick={addObjective}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {project.objectives.length > 0 && (
            <div className="space-y-2">
              {project.objectives.map((objective, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 border rounded"
                >
                  <Target className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="flex-1">{objective}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeObjective(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Prerequisites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Prerequisites
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newPrerequisite}
              onChange={(e) => setNewPrerequisite(e.target.value)}
              placeholder="Add a prerequisite..."
              onKeyPress={(e) => e.key === "Enter" && addPrerequisite()}
            />
            <Button onClick={addPrerequisite}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {project.prerequisites.length > 0 && (
            <div className="space-y-2">
              {project.prerequisites.map((prerequisite, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 p-2 border rounded"
                >
                  <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                  <span className="flex-1">{prerequisite}</span>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removePrerequisite(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
