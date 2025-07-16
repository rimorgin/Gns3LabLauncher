"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader } from "@clnt/components/ui/card";
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
import { Switch } from "@clnt/components/ui/switch";
import {
  GripVertical,
  Edit,
  Trash2,
  BookOpen,
  Code,
  HelpCircle,
  Play,
  Video,
  Clock,
  Target,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import type {
  LearningPathItem,
  ContentSection,
  ProjectContent,
} from "@clnt/types/project-content";

interface LearningPathBuilderProps {
  project: ProjectContent;
  onUpdate: (updates: Partial<ProjectContent>) => void;
}

export function LearningPathBuilder({
  project,
  onUpdate,
}: LearningPathBuilderProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const addLearningPathItem = (type: LearningPathItem["type"]) => {
    const newItem: LearningPathItem = {
      id: `item_${Date.now()}`,
      title: "",
      description: "",
      type,
      order: project.learningPath.length + 1,
      estimatedTime: 30,
      content: [],
      isRequired: true,
      prerequisites: [],
    };

    onUpdate({
      learningPath: [...project.learningPath, newItem],
    });

    setEditingItem(newItem.id);
    setExpandedItems((prev) => new Set([...prev, newItem.id]));
  };

  const updateLearningPathItem = (
    itemId: string,
    updates: Partial<LearningPathItem>,
  ) => {
    onUpdate({
      learningPath: project.learningPath.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item,
      ),
    });
  };

  const deleteLearningPathItem = (itemId: string) => {
    onUpdate({
      learningPath: project.learningPath
        .filter((item) => item.id !== itemId)
        .map((item, index) => ({ ...item, order: index + 1 })),
    });
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      newSet.delete(itemId);
      return newSet;
    });
  };

  const addContentSection = (itemId: string, type: ContentSection["type"]) => {
    const item = project.learningPath.find((i) => i.id === itemId);
    if (!item) return;

    const newSection: ContentSection = {
      id: `section_${Date.now()}`,
      title: "",
      type,
      content: "",
      order: item.content.length + 1,
      metadata: {},
    };

    updateLearningPathItem(itemId, {
      content: [...item.content, newSection],
    });
  };

  const updateContentSection = (
    itemId: string,
    sectionId: string,
    updates: Partial<ContentSection>,
  ) => {
    const item = project.learningPath.find((i) => i.id === itemId);
    if (!item) return;

    updateLearningPathItem(itemId, {
      content: item.content.map((section) =>
        section.id === sectionId ? { ...section, ...updates } : section,
      ),
    });
  };

  const deleteContentSection = (itemId: string, sectionId: string) => {
    const item = project.learningPath.find((i) => i.id === itemId);
    if (!item) return;

    updateLearningPathItem(itemId, {
      content: item.content
        .filter((section) => section.id !== sectionId)
        .map((section, index) => ({ ...section, order: index + 1 })),
    });
  };

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const getItemIcon = (type: LearningPathItem["type"]) => {
    const icons = {
      READING: BookOpen,
      LAB: Code,
      QUIZ: HelpCircle,
      PROJECT: Play,
      VIDEO: Video,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const getItemColor = (type: LearningPathItem["type"]) => {
    const colors = {
      READING: "bg-blue-100 text-blue-800",
      LAB: "bg-green-100 text-green-800",
      QUIZ: "bg-yellow-100 text-yellow-800",
      PROJECT: "bg-purple-100 text-purple-800",
      VIDEO: "bg-red-100 text-red-800",
    };
    return colors[type];
  };

  const getSectionIcon = (type: ContentSection["type"]) => {
    const icons = {
      TEXT: BookOpen,
      CODE: Code,
      IMAGE: Target,
      VIDEO: Video,
      CALLOUT: Target,
      INTERACTIVE: Play,
    };
    const Icon = icons[type];
    return <Icon className="h-4 w-4" />;
  };

  const renderContentSectionEditor = (
    item: LearningPathItem,
    section: ContentSection,
  ) => {
    return (
      <Card key={section.id} className="ml-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getSectionIcon(section.type)}
              <span className="font-medium">{section.type}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => deleteContentSection(item.id, section.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Section Title</Label>
            <Input
              value={section.title}
              onChange={(e) =>
                updateContentSection(item.id, section.id, {
                  title: e.target.value,
                })
              }
              placeholder="Enter section title..."
            />
          </div>

          {section.type === "TEXT" && (
            <div>
              <Label>Content</Label>
              <Textarea
                value={section.content}
                onChange={(e) =>
                  updateContentSection(item.id, section.id, {
                    content: e.target.value,
                  })
                }
                placeholder="Enter your content here. You can use HTML tags for formatting..."
                className="min-h-[150px]"
              />
            </div>
          )}

          {section.type === "CODE" && (
            <div className="space-y-3">
              <div>
                <Label>Programming Language</Label>
                <Input
                  value={section.metadata?.language || ""}
                  onChange={(e) =>
                    updateContentSection(item.id, section.id, {
                      metadata: {
                        ...section.metadata,
                        language: e.target.value,
                      },
                    })
                  }
                  placeholder="e.g., javascript, python, bash..."
                />
              </div>
              <div>
                <Label>Code Content</Label>
                <Textarea
                  value={section.content}
                  onChange={(e) =>
                    updateContentSection(item.id, section.id, {
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter your code here..."
                  className="min-h-[150px] font-mono"
                />
              </div>
            </div>
          )}

          {section.type === "VIDEO" && (
            <div>
              <Label>Video URL</Label>
              <Input
                value={section.metadata?.videoUrl || ""}
                onChange={(e) =>
                  updateContentSection(item.id, section.id, {
                    metadata: { ...section.metadata, videoUrl: e.target.value },
                  })
                }
                placeholder="Enter video URL (YouTube, Vimeo, etc.)..."
              />
            </div>
          )}

          {section.type === "IMAGE" && (
            <div className="space-y-3">
              <div>
                <Label>Image URL</Label>
                <Input
                  value={section.content}
                  onChange={(e) =>
                    updateContentSection(item.id, section.id, {
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter image URL..."
                />
              </div>
              <div>
                <Label>Alt Text</Label>
                <Input
                  value={section.metadata?.imageAlt || ""}
                  onChange={(e) =>
                    updateContentSection(item.id, section.id, {
                      metadata: {
                        ...section.metadata,
                        imageAlt: e.target.value,
                      },
                    })
                  }
                  placeholder="Describe the image for accessibility..."
                />
              </div>
            </div>
          )}

          {section.type === "CALLOUT" && (
            <div className="space-y-3">
              <div>
                <Label>Callout Type</Label>
                <Select
                  value={section.metadata?.calloutType || "INFO"}
                  onValueChange={(value) =>
                    updateContentSection(item.id, section.id, {
                      metadata: {
                        ...section.metadata,
                        calloutType: value as
                          | "INFO"
                          | "WARNING"
                          | "SUCCESS"
                          | "ERROR",
                      },
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="INFO">Info</SelectItem>
                    <SelectItem value="WARNING">Warning</SelectItem>
                    <SelectItem value="SUCCESS">Success</SelectItem>
                    <SelectItem value="ERROR">Error</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Message</Label>
                <Textarea
                  value={section.content}
                  onChange={(e) =>
                    updateContentSection(item.id, section.id, {
                      content: e.target.value,
                    })
                  }
                  placeholder="Enter important information or key points..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Learning Path</h2>
          <p className="text-muted-foreground">
            Build the step-by-step learning journey
          </p>
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => addLearningPathItem("READING")}>
            <BookOpen className="h-4 w-4 mr-2" />
            Reading
          </Button>
          <Button size="sm" onClick={() => addLearningPathItem("LAB")}>
            <Code className="h-4 w-4 mr-2" />
            Lab
          </Button>
          <Button size="sm" onClick={() => addLearningPathItem("QUIZ")}>
            <HelpCircle className="h-4 w-4 mr-2" />
            Quiz
          </Button>
          <Button size="sm" onClick={() => addLearningPathItem("VIDEO")}>
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>
          <Button size="sm" onClick={() => addLearningPathItem("PROJECT")}>
            <Play className="h-4 w-4 mr-2" />
            Project
          </Button>
        </div>
      </div>

      {project.learningPath.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h3 className="text-lg font-medium mb-2">
              No learning path items yet
            </h3>
            <p className="text-muted-foreground mb-4">
              Start building your project by adding reading materials, labs,
              quizzes, or videos
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {project.learningPath
            .sort((a, b) => a.order - b.order)
            .map((item) => {
              const isExpanded = expandedItems.has(item.id);
              const isEditing = editingItem === item.id;

              return (
                <Card
                  key={item.id}
                  className={isEditing ? "ring-2 ring-primary" : ""}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-grab"
                        >
                          <GripVertical className="h-4 w-4" />
                        </Button>

                        <div className="flex items-center gap-2">
                          <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-medium">
                            {item.order}
                          </span>
                          <Badge className={getItemColor(item.type)}>
                            {getItemIcon(item.type)}
                            <span className="ml-1">{item.type}</span>
                          </Badge>
                        </div>

                        <div className="flex-1">
                          <h3 className="font-medium">
                            {item.title || `Untitled ${item.type}`}
                          </h3>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {item.estimatedTime} min
                            </div>
                            <div className="flex items-center gap-1">
                              <Target className="h-3 w-3" />
                              {item.content.length} sections
                            </div>
                            {item.isRequired && (
                              <Badge variant="outline" className="text-xs">
                                Required
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleExpanded(item.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            setEditingItem(isEditing ? null : item.id)
                          }
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteLearningPathItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>

                  {(isExpanded || isEditing) && (
                    <CardContent className="space-y-4">
                      {isEditing && (
                        <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Title</Label>
                              <Input
                                value={item.title}
                                onChange={(e) =>
                                  updateLearningPathItem(item.id, {
                                    title: e.target.value,
                                  })
                                }
                                placeholder="Enter item title..."
                              />
                            </div>
                            <div>
                              <Label>Estimated Time (minutes)</Label>
                              <Input
                                type="number"
                                min="5"
                                max="300"
                                value={item.estimatedTime}
                                onChange={(e) =>
                                  updateLearningPathItem(item.id, {
                                    estimatedTime:
                                      Number.parseInt(e.target.value) || 30,
                                  })
                                }
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={item.description}
                              onChange={(e) =>
                                updateLearningPathItem(item.id, {
                                  description: e.target.value,
                                })
                              }
                              placeholder="Describe what students will learn in this section..."
                            />
                          </div>

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={item.isRequired}
                              onCheckedChange={(checked) =>
                                updateLearningPathItem(item.id, {
                                  isRequired: checked,
                                })
                              }
                            />
                            <Label>Required for completion</Label>
                          </div>
                        </div>
                      )}

                      {/* Content Sections */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-medium">Content Sections</h4>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentSection(item.id, "TEXT")}
                            >
                              Text
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => addContentSection(item.id, "CODE")}
                            >
                              Code
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addContentSection(item.id, "IMAGE")
                              }
                            >
                              Image
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addContentSection(item.id, "VIDEO")
                              }
                            >
                              Video
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                addContentSection(item.id, "CALLOUT")
                              }
                            >
                              Callout
                            </Button>
                          </div>
                        </div>

                        {item.content.length === 0 ? (
                          <div className="text-center py-4 text-muted-foreground">
                            No content sections yet. Add sections using the
                            buttons above.
                          </div>
                        ) : (
                          <div className="space-y-3">
                            {item.content
                              .sort((a, b) => a.order - b.order)
                              .map((section) =>
                                renderContentSectionEditor(item, section),
                              )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
}
