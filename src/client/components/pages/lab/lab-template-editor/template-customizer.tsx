"use client";

import type React from "react";

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
import type { LabTemplate } from "@clnt/types/lab-template";

interface TemplateCustomizerProps {
  template: LabTemplate;
  onSave: (
    customizedTemplate: LabTemplate,
    variables: Record<string, string>,
  ) => void;
  onBack: () => void;
  onPreview: () => void;
}

export function TemplateCustomizer({
  template,
  onSave,
  onBack,
  onPreview,
}: TemplateCustomizerProps) {
  const [customizedTemplate, setCustomizedTemplate] =
    useState<LabTemplate>(template);
  const [variableValues, setVariableValues] = useState<Record<string, string>>(
    () => {
      const initialValues: Record<string, string> = {};
      template.variables.forEach((variable) => {
        initialValues[variable.name] = variable.defaultValue;
      });
      return initialValues;
    },
  );

  const handleTemplateChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setCustomizedTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariableChange = (name: string, value: string) => {
    setVariableValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleBooleanVariableChange = (name: string, checked: boolean) => {
    setVariableValues((prev) => ({ ...prev, [name]: String(checked) }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(customizedTemplate, variableValues);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Templates
          </Button>
          <div>
            <h1 className="text-2xl font-bold">Customize Template</h1>
            <p className="text-muted-foreground">
              Customize "{template.title}" for your specific needs
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onPreview}>
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button onClick={() => handleSubmit({} as React.FormEvent)}>
            <Save className="h-4 w-4 mr-2" />
            Create Lab
          </Button>
        </div>
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
                  <Label htmlFor="name">Lab Name</Label>
                  <Input
                    id="name"
                    value={customizedTemplate.title}
                    onChange={handleTemplateChange}
                    placeholder="Enter lab name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <Select
                    value={customizedTemplate.difficulty}
                    onValueChange={(value: any) =>
                      setCustomizedTemplate((prev) => ({
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
                  value={customizedTemplate.description}
                  onChange={handleTemplateChange}
                  placeholder="Describe what students will learn in this lab"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
                <Input
                  id="estimatedTime"
                  type="number"
                  value={customizedTemplate.estimatedTime}
                  onChange={(e) =>
                    setCustomizedTemplate((prev) => ({
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
                  {customizedTemplate.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setCustomizedTemplate((prev) => ({
                          ...prev,
                          tags: prev.tags.filter((t) => t !== tag),
                        }))
                      }
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value=""
                    onChange={(e) =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        tags: [...prev.tags, e.target.value.trim()],
                      }))
                    }
                    placeholder="Add a tag"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        tags: [...prev.tags, e.target.value.trim()],
                      }))
                    }
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        tags: [...prev.tags, ""],
                      }))
                    }
                  >
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
                  {customizedTemplate.objectives.map((objective, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded"
                    >
                      <span className="text-sm">{objective}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setCustomizedTemplate((prev) => ({
                            ...prev,
                            objectives: prev.objectives.filter(
                              (_, i) => i !== index,
                            ),
                          }))
                        }
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    value=""
                    onChange={(e) =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        objectives: [...prev.objectives, e.target.value.trim()],
                      }))
                    }
                    placeholder="Add learning objective"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        objectives: [...prev.objectives, e.target.value.trim()],
                      }))
                    }
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        objectives: [...prev.objectives, ""],
                      }))
                    }
                  >
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
                  {customizedTemplate.prerequisites.map(
                    (prerequisite, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-2 border rounded"
                      >
                        <span className="text-sm">{prerequisite}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setCustomizedTemplate((prev) => ({
                              ...prev,
                              prerequisites: prev.prerequisites.filter(
                                (_, i) => i !== index,
                              ),
                            }))
                          }
                        >
                          ×
                        </Button>
                      </div>
                    ),
                  )}
                </div>
                <div className="flex gap-2">
                  <Input
                    value=""
                    onChange={(e) =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        prerequisites: [
                          ...prev.prerequisites,
                          e.target.value.trim(),
                        ],
                      }))
                    }
                    placeholder="Add prerequisite"
                    onKeyDown={(e) =>
                      e.key === "Enter" &&
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        prerequisites: [
                          ...prev.prerequisites,
                          e.target.value.trim(),
                        ],
                      }))
                    }
                  />
                  <Button
                    type="button"
                    onClick={() =>
                      setCustomizedTemplate((prev) => ({
                        ...prev,
                        prerequisites: [...prev.prerequisites, ""],
                      }))
                    }
                  >
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
                  <div className="max-w-md">
                    {variable.type === "boolean" ? (
                      <div className="flex items-center space-x-2 mt-2">
                        <Switch
                          id={`var-${variable.name}`}
                          checked={variableValues[variable.name] === "true"}
                          onCheckedChange={(checked) =>
                            handleBooleanVariableChange(variable.name, checked)
                          }
                        />
                        <Label htmlFor={`var-${variable.name}`}>
                          {variableValues[variable.name] === "true"
                            ? "Enabled"
                            : "Disabled"}
                        </Label>
                      </div>
                    ) : (
                      <Input
                        id={`var-${variable.name}`}
                        type={variable.type === "number" ? "number" : "text"}
                        value={variableValues[variable.name]}
                        onChange={(e) =>
                          handleVariableChange(variable.name, e.target.value)
                        }
                        required={variable.required}
                      />
                    )}
                  </div>
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
                        <strong>Name:</strong> {customizedTemplate.title}
                      </div>
                      <div>
                        <strong>Difficulty:</strong>{" "}
                        {customizedTemplate.difficulty}
                      </div>
                      <div>
                        <strong>Duration:</strong>{" "}
                        {customizedTemplate.estimatedTime} minutes
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Description</h4>
                    <p className="text-sm text-muted-foreground">
                      {customizedTemplate.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">
                      Learning Objectives (
                      {customizedTemplate.objectives.length})
                    </h4>
                    <ul className="text-sm space-y-1">
                      {customizedTemplate.objectives
                        .slice(0, 3)
                        .map((objective, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                            {objective}
                          </li>
                        ))}
                      {customizedTemplate.objectives.length > 3 && (
                        <li className="text-muted-foreground">
                          +{customizedTemplate.objectives.length - 3} more...
                        </li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">
                      Prerequisites ({customizedTemplate.prerequisites.length})
                    </h4>
                    <ul className="text-sm space-y-1">
                      {customizedTemplate.prerequisites
                        .slice(0, 3)
                        .map((prerequisite, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0" />
                            {prerequisite}
                          </li>
                        ))}
                      {customizedTemplate.prerequisites.length > 3 && (
                        <li className="text-muted-foreground">
                          +{customizedTemplate.prerequisites.length - 3} more...
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
                          {variableValues[variable.name] ||
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
                  {customizedTemplate.tags.map((tag) => (
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
