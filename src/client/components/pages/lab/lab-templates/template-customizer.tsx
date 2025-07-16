"use client";

import { useState } from "react";
import { Save, ArrowLeft, Eye, Settings } from "lucide-react";
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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Separator } from "@clnt/components/ui/separator";
import { Switch } from "@clnt/components/ui/switch";
import type { LabTemplate, TemplateVariable } from "@clnt/types/lab-template";

interface TemplateCustomizerProps {
  template: LabTemplate;
  onSave: (
    customizedTemplate: LabTemplate,
    variables: Record<string, string>,
  ) => void;
  onBack: () => void;
  onPreview: () => void;
}

interface CustomizationState {
  title: string;
  description: string;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  estimatedTime: number;
  objectives: string[];
  prerequisites: string[];
  tags: string[];
  variables: Record<string, string>;
}

export function TemplateCustomizer({
  template,
  onSave,
  onBack,
  onPreview,
}: TemplateCustomizerProps) {
  const [customization, setCustomization] = useState<CustomizationState>({
    title: template.title,
    description: template.description,
    difficulty: template.difficulty,
    estimatedTime: template.estimatedTime,
    objectives: [...template.objectives],
    prerequisites: [...template.prerequisites],
    tags: [...template.tags],
    variables: template.variables.reduce(
      (acc, variable) => {
        acc[variable.name] = variable.defaultValue;
        return acc;
      },
      {} as Record<string, string>,
    ),
  });

  const [newObjective, setNewObjective] = useState("");
  const [newPrerequisite, setNewPrerequisite] = useState("");
  const [newTag, setNewTag] = useState("");

  const handleVariableChange = (variableName: string, value: string) => {
    setCustomization((prev) => ({
      ...prev,
      variables: {
        ...prev.variables,
        [variableName]: value,
      },
    }));
  };

  const addObjective = () => {
    if (newObjective.trim()) {
      setCustomization((prev) => ({
        ...prev,
        objectives: [...prev.objectives, newObjective.trim()],
      }));
      setNewObjective("");
    }
  };

  const removeObjective = (index: number) => {
    setCustomization((prev) => ({
      ...prev,
      objectives: prev.objectives.filter((_, i) => i !== index),
    }));
  };

  const addPrerequisite = () => {
    if (newPrerequisite.trim()) {
      setCustomization((prev) => ({
        ...prev,
        prerequisites: [...prev.prerequisites, newPrerequisite.trim()],
      }));
      setNewPrerequisite("");
    }
  };

  const removePrerequisite = (index: number) => {
    setCustomization((prev) => ({
      ...prev,
      prerequisites: prev.prerequisites.filter((_, i) => i !== index),
    }));
  };

  const addTag = () => {
    if (newTag.trim() && !customization.tags.includes(newTag.trim())) {
      setCustomization((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCustomization((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSave = () => {
    const customizedTemplate: LabTemplate = {
      ...template,
      title: customization.title,
      description: customization.description,
      difficulty: customization.difficulty,
      estimatedTime: customization.estimatedTime,
      objectives: customization.objectives,
      prerequisites: customization.prerequisites,
      tags: customization.tags,
      id: `${template.id}-${Date.now()}`, // Generate new ID for customized template
      createdAt: new Date(),
      updatedAt: new Date(),
      usageCount: 0,
    };

    onSave(customizedTemplate, customization.variables);
  };

  const getVariableInput = (variable: TemplateVariable) => {
    const value =
      customization.variables[variable.name] || variable.defaultValue;

    switch (variable.type) {
      case "boolean":
        return (
          <Switch
            checked={value === "true"}
            onCheckedChange={(checked) =>
              handleVariableChange(variable.name, checked.toString())
            }
          />
        );
      case "number":
        return (
          <Input
            type="number"
            value={value}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            placeholder={variable.defaultValue}
          />
        );
      default:
        return (
          <Input
            value={value}
            onChange={(e) =>
              handleVariableChange(variable.name, e.target.value)
            }
            placeholder={variable.defaultValue}
          />
        );
    }
  };

  return (
    <div className="max-w-full mx-auto space-y-6 p-10">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Create Lab
          </Button>
        </div>
      </div>
      <div>
        <h1 className="text-2xl font-bold">Customize Template</h1>
        <p className="text-muted-foreground">
          Customize "{template.title}" for your specific needs
        </p>
      </div>

      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic">Basic Info</TabsTrigger>
          <TabsTrigger value="learning">Learning</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="summary">Summary</TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Customize the basic details of your lab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Lab Title/Name</Label>
                  <Input
                    id="title"
                    value={customization.title}
                    onChange={(e) =>
                      setCustomization((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    placeholder="Enter lab name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={customization.difficulty}
                    onValueChange={(value: CustomizationState["difficulty"]) =>
                      setCustomization((prev) => ({
                        ...prev,
                        difficulty: value,
                      }))
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={customization.description}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  placeholder="Describe what students will learn in this lab"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={customization.estimatedTime}
                  onChange={(e) =>
                    setCustomization((prev) => ({
                      ...prev,
                      estimatedTime: Number.parseInt(e.target.value) || 0,
                    }))
                  }
                  placeholder="60"
                />
              </div>

              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {customization.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => removeTag(tag)}
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === "Enter" && addTag()}
                  />
                  <Button type="button" onClick={addTag}>
                    Add
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="learning" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>
                  What will students achieve in this lab?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {customization.objectives.map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{objective}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeObjective(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newObjective}
                    onChange={(e) => setNewObjective(e.target.value)}
                    placeholder="Add learning objective"
                    onKeyPress={(e) => e.key === "Enter" && addObjective()}
                  />
                  <Button type="button" onClick={addObjective}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Prerequisites</CardTitle>
                <CardDescription>
                  What should students know before starting?
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {customization.prerequisites.map((prerequisite, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{prerequisite}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removePrerequisite(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value={newPrerequisite}
                    onChange={(e) => setNewPrerequisite(e.target.value)}
                    placeholder="Add prerequisite"
                    onKeyPress={(e) => e.key === "Enter" && addPrerequisite()}
                  />
                  <Button type="button" onClick={addPrerequisite}>
                    Add
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="variables" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Template Variables
              </CardTitle>
              <CardDescription>
                Customize the configurable parameters for this lab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {template.variables.map((variable) => (
                <div
                  key={variable.name}
                  className="space-y-3 p-4 border rounded-lg"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <Label className="text-base font-medium">
                        {variable.name}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {variable.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{variable.type}</Badge>
                      {variable.required && (
                        <Badge variant="destructive">Required</Badge>
                      )}
                    </div>
                  </div>
                  <div className="max-w-md">{getVariableInput(variable)}</div>
                  <div className="text-xs text-muted-foreground">
                    Default:{" "}
                    <code className="bg-gray-100 px-1 py-0.5 rounded">
                      {variable.defaultValue}
                    </code>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customization Summary</CardTitle>
              <CardDescription>
                Review your customizations before creating the lab
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>Title:</strong> {customization.title}
                      </div>
                      <div>
                        <strong>Difficulty:</strong> {customization.difficulty}
                      </div>
                      <div>
                        <strong>Duration:</strong> {customization.estimatedTime}{" "}
                        minutes
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {customization.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      Learning Objectives ({customization.objectives.length})
                    </h4>
                    <ul className="text-sm space-y-1">
                      {customization.objectives
                        .slice(0, 3)
                        .map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      {customization.objectives.length > 3 && (
                        <li className="text-muted-foreground">
                          +{customization.objectives.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      Prerequisites ({customization.prerequisites.length})
                    </h4>
                    <ul className="text-sm space-y-1">
                      {customization.prerequisites
                        .slice(0, 3)
                        .map((prerequisite, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            {prerequisite}
                          </li>
                        ))}
                      {customization.prerequisites.length > 3 && (
                        <li className="text-muted-foreground">
                          +{customization.prerequisites.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Variable Customizations</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {template.variables.map((variable) => (
                    <div key={variable.name} className="p-3 border rounded">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">
                          {variable.name}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {variable.type}
                        </Badge>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Value: </span>
                        <code className="bg-gray-100 px-1 py-0.5 rounded">
                          {customization.variables[variable.name] ||
                            variable.defaultValue}
                        </code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {customization.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
