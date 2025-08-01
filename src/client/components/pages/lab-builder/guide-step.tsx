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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Plus, Trash2, BookOpen, ChevronUp, ChevronDown } from "lucide-react";
import type {
  LabGuide,
  LabSection,
  LabContent,
  LabTask,
  VerificationStep,
} from "@clnt/types/lab";
import { useImmer } from "use-immer";

interface GuideStepProps {
  data: Partial<LabGuide>;
  onUpdate: (data: Partial<LabGuide>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function GuideStep({ data, onUpdate, onNext, onPrev }: GuideStepProps) {
  const [formData, setFormData] = useImmer<Partial<LabGuide>>({
    labId: data.labId || undefined,
    sections: data.sections || [],
    currentSection: 0,
    //completedSections: [],
  });

  const handleNext = () => {
    onUpdate(formData); // send updated state
    onNext();
  };

  const handlePrev = () => {
    onUpdate(formData);
    onPrev();
  };

  const updateFormData = (mutator: (draft: Partial<LabGuide>) => void) => {
    setFormData(mutator);
  };

  const [collapsedSections, setCollapsedSections] = useState<
    Record<string, boolean>
  >({});

  const toggleSectionCollapse = (sectionId: string) => {
    setCollapsedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const addSection = () => {
    const newSection: LabSection = {
      id: crypto.randomUUID(),
      guideId: data.labId || undefined,
      title: `Section ${(formData.sections ?? []).length + 1}`,
      type: "step",
      order: (formData.sections ?? []).length,
      estimatedTime: 15,
      content: [],
      tasks: [],
      verifications: [],
      hints: [],
    };

    updateFormData((draft) => {
      (draft.sections ??= []).push(newSection);
    });
  };

  const updateSection = <K extends keyof LabSection>(
    index: number,
    field: K,
    value: LabSection[K],
  ) => {
    updateFormData((draft) => {
      if (draft.sections && draft.sections[index]) {
        draft.sections[index][field] = value;
      }
    });
  };

  const removeSection = (index: number) => {
    updateFormData((draft) => {
      if (draft.sections) {
        draft.sections.splice(index, 1);
      }
    });
  };

  const moveSection = (index: number, direction: "up" | "down") => {
    const newIndex = direction === "up" ? index - 1 : index + 1;

    updateFormData((draft) => {
      if (!draft.sections) return;
      if (newIndex < 0 || newIndex >= draft.sections.length) return;

      const [movedSection] = draft.sections.splice(index, 1);
      draft.sections.splice(newIndex, 0, movedSection);

      // Update order numbers
      draft.sections.forEach((section, i) => {
        section.order = i;
      });
    });
  };

  const addContent = (sectionIndex: number) => {
    const newContent: LabContent = {
      id: crypto.randomUUID(),
      type: "text",
      content: "",
    };

    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.content?.push(newContent);
    });
  };

  const updateContent = <K extends keyof LabContent>(
    sectionIndex: number,
    contentIndex: number,
    field: K,
    value: LabContent[K],
  ) => {
    updateFormData((draft) => {
      const content = draft.sections?.[sectionIndex]?.content?.[contentIndex];
      if (content) {
        content[field] = value;
      }
    });
  };

  const removeContent = (sectionIndex: number, contentIndex: number) => {
    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.content?.splice(contentIndex, 1);
    });
  };

  const addTask = (sectionIndex: number) => {
    const newTask: LabTask = {
      id: crypto.randomUUID(),
      description: "",
      commands: [],
      expectedResult: "",
      isCompleted: false,
      hints: [],
      device: "",
    };

    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.tasks?.push(newTask);
    });
  };

  const updateTask = <K extends keyof LabTask>(
    sectionIndex: number,
    taskIndex: number,
    field: K,
    value: LabTask[K],
  ) => {
    updateFormData((draft) => {
      const task = draft.sections?.[sectionIndex]?.tasks?.[taskIndex];
      if (task) {
        task[field] = value;
      }
    });
  };

  const removeTask = (sectionIndex: number, taskIndex: number) => {
    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.tasks?.splice(taskIndex, 1);
    });
  };

  const addVerification = (sectionIndex: number) => {
    const newVerification: VerificationStep = {
      id: crypto.randomUUID(),
      description: "",
      commands: [],
      expectedOutput: [],
      device: "",
      isCompleted: false,
    };

    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.verifications?.push(newVerification);
    });
  };

  const updateVerification = <K extends keyof VerificationStep>(
    sectionIndex: number,
    verificationIndex: number,
    field: K,
    value: VerificationStep[K],
  ) => {
    updateFormData((draft) => {
      const verification =
        draft.sections?.[sectionIndex]?.verifications?.[verificationIndex];
      if (verification) {
        verification[field] = value;
      }
    });
  };

  const removeVerification = (
    sectionIndex: number,
    verificationIndex: number,
  ) => {
    updateFormData((draft) => {
      draft.sections?.[sectionIndex]?.verifications?.splice(
        verificationIndex,
        1,
      );
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="w-5 h-5" />
          Lab Guide Creation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Lab Sections</h3>
          <Button onClick={addSection} size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        <div className="space-y-6">
          {(formData.sections ?? []).map((section, sectionIndex) => (
            <Card key={section.id} className="p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    Section {sectionIndex + 1}
                  </span>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(sectionIndex, "up")}
                      disabled={sectionIndex === 0}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveSection(sectionIndex, "down")}
                      disabled={sectionIndex === formData.sections!.length - 1}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleSectionCollapse(section.id)}
                  >
                    {collapsedSections[section.id] ? (
                      <>
                        <p>Toggle Collapse</p>
                        <ChevronDown className="w-4 h-4" />
                      </>
                    ) : (
                      <>
                        <p>Toggle Collapse</p>
                        <ChevronUp className="w-4 h-4" />
                      </>
                    )}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Section Title</Label>
                  <Input
                    value={section.title}
                    onChange={(e) =>
                      updateSection(sectionIndex, "title", e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label>Section Type</Label>
                  <Select
                    value={section.type}
                    onValueChange={(value: LabSection["type"]) =>
                      updateSection(sectionIndex, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="introduction">Introduction</SelectItem>
                      <SelectItem value="step">Step</SelectItem>
                      <SelectItem value="verification">Verification</SelectItem>
                      <SelectItem value="troubleshooting">
                        Troubleshooting
                      </SelectItem>
                      <SelectItem value="summary">Summary</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Estimated Time (minutes)</Label>
                  <Input
                    type="number"
                    value={section.estimatedTime}
                    onChange={(e) =>
                      updateSection(
                        sectionIndex,
                        "estimatedTime",
                        Number.parseInt(e.target.value) || 0,
                      )
                    }
                  />
                </div>
              </div>
              {!collapsedSections[section.id] && (
                <Tabs defaultValue="content" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="content">Content</TabsTrigger>
                    <TabsTrigger value="tasks">Tasks</TabsTrigger>
                    <TabsTrigger value="verification">Verification</TabsTrigger>
                  </TabsList>

                  <TabsContent value="content" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Section Content</h4>
                      <Button
                        onClick={() => addContent(sectionIndex)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Content
                      </Button>
                    </div>
                    {(section.content ?? []).map((content, contentIndex) => (
                      <Card key={content.id} className="p-3">
                        <div className="grid grid-cols-2 gap-4 mb-3">
                          <div>
                            <Label>Content Type</Label>
                            <Select
                              value={content.type}
                              onValueChange={(value: LabContent["type"]) =>
                                updateContent(
                                  sectionIndex,
                                  contentIndex,
                                  "type",
                                  value,
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="text">Text</SelectItem>
                                <SelectItem value="code">Code</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="video">Video</SelectItem>
                                <SelectItem value="callout">Callout</SelectItem>
                                <SelectItem value="topology">
                                  Topology
                                </SelectItem>
                                <SelectItem value="terminal">
                                  Terminal
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex items-end">
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeContent(sectionIndex, contentIndex)
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <Label>Content</Label>
                          <Textarea
                            value={content.content}
                            onChange={(e) =>
                              updateContent(
                                sectionIndex,
                                contentIndex,
                                "content",
                                e.target.value,
                              )
                            }
                            rows={3}
                          />
                        </div>
                        {content.type === "code" && (
                          <div>
                            <Label>Language</Label>
                            <Input
                              value={content.metadata?.language || ""}
                              onChange={(e) =>
                                updateContent(
                                  sectionIndex,
                                  contentIndex,
                                  "metadata",
                                  {
                                    ...content.metadata,
                                    language: e.target.value,
                                  },
                                )
                              }
                              placeholder="e.g. python"
                            />
                          </div>
                        )}

                        {content.type === "terminal" && (
                          <>
                            <div>
                              <Label>Device</Label>
                              <Input
                                value={content.metadata?.device || ""}
                                onChange={(e) =>
                                  updateContent(
                                    sectionIndex,
                                    contentIndex,
                                    "metadata",
                                    {
                                      ...content.metadata,
                                      device: e.target.value,
                                    },
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Commands (one per line)</Label>
                              <Textarea
                                value={content.metadata?.command || ""}
                                onChange={(e) =>
                                  updateContent(
                                    sectionIndex,
                                    contentIndex,
                                    "metadata",
                                    {
                                      ...content.metadata,
                                      command: e.target.value,
                                    },
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Expected Output</Label>
                              <Textarea
                                value={content.metadata?.expected_output || ""}
                                onChange={(e) =>
                                  updateContent(
                                    sectionIndex,
                                    contentIndex,
                                    "metadata",
                                    {
                                      ...content.metadata,
                                      expected_output: e.target.value,
                                    },
                                  )
                                }
                              />
                            </div>
                          </>
                        )}

                        {content.type === "callout" && (
                          <div>
                            <Label>Callout Type</Label>
                            <Select
                              value={content.metadata?.callout_type || "info"}
                              onValueChange={(value) =>
                                updateContent(
                                  sectionIndex,
                                  contentIndex,
                                  "metadata",
                                  {
                                    ...content.metadata,
                                    callout_type: value as
                                      | "info"
                                      | "warning"
                                      | "success"
                                      | "error"
                                      | "tip",
                                  },
                                )
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="info">Info</SelectItem>
                                <SelectItem value="warning">Warning</SelectItem>
                                <SelectItem value="success">Success</SelectItem>
                                <SelectItem value="error">Error</SelectItem>
                                <SelectItem value="tip">Tip</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="tasks" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Section Tasks</h4>
                      <Button onClick={() => addTask(sectionIndex)} size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Add Task
                      </Button>
                    </div>
                    {(section.tasks ?? []).map((task, taskIndex) => (
                      <Card key={task.id} className="p-3">
                        <div className="flex justify-between items-start mb-3">
                          <h5 className="font-medium">Task {taskIndex + 1}</h5>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => removeTask(sectionIndex, taskIndex)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <Label>Task Description</Label>
                            <Textarea
                              value={task.description}
                              onChange={(e) =>
                                updateTask(
                                  sectionIndex,
                                  taskIndex,
                                  "description",
                                  e.target.value,
                                )
                              }
                              rows={2}
                            />
                          </div>
                          <div>
                            <Label>Device (optional)</Label>
                            <Input
                              value={task.device || ""}
                              onChange={(e) =>
                                updateTask(
                                  sectionIndex,
                                  taskIndex,
                                  "device",
                                  e.target.value,
                                )
                              }
                              placeholder="Router1, Switch1, etc."
                            />
                          </div>
                          <div>
                            <Label>Commands (one per line)</Label>
                            <Textarea
                              value={(task.commands || []).join("\n")}
                              onChange={(e) =>
                                updateTask(
                                  sectionIndex,
                                  taskIndex,
                                  "commands",
                                  e.target.value.split("\n"),
                                )
                              }
                              rows={3}
                            />
                          </div>

                          <div>
                            <Label>Hints (one per line)</Label>
                            <Textarea
                              value={(task.hints || []).join("\n")}
                              onChange={(e) =>
                                updateTask(
                                  sectionIndex,
                                  taskIndex,
                                  "hints",
                                  e.target.value.split("\n"),
                                )
                              }
                              rows={3}
                            />
                          </div>
                          <div>
                            <Label>Expected Result (optional)</Label>
                            <Textarea
                              value={task.expectedResult || ""}
                              onChange={(e) =>
                                updateTask(
                                  sectionIndex,
                                  taskIndex,
                                  "expectedResult",
                                  e.target.value,
                                )
                              }
                              rows={2}
                            />
                          </div>
                        </div>
                      </Card>
                    ))}
                  </TabsContent>

                  <TabsContent value="verification" className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">Verification Steps</h4>
                      <Button
                        onClick={() => addVerification(sectionIndex)}
                        size="sm"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add Verification
                      </Button>
                    </div>
                    {(section.verifications ?? []).map(
                      (verification, verificationIndex) => (
                        <Card key={verification.id} className="p-3">
                          <div className="flex justify-between items-start mb-3">
                            <h5 className="font-medium">
                              Verification {verificationIndex + 1}
                            </h5>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                removeVerification(
                                  sectionIndex,
                                  verificationIndex,
                                )
                              }
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <Label>Description</Label>
                              <Input
                                value={verification.description}
                                onChange={(e) =>
                                  updateVerification(
                                    sectionIndex,
                                    verificationIndex,
                                    "description",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Device</Label>
                              <Input
                                value={verification.device}
                                onChange={(e) =>
                                  updateVerification(
                                    sectionIndex,
                                    verificationIndex,
                                    "device",
                                    e.target.value,
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Commands (one per line)</Label>
                              <Textarea
                                value={(verification.commands || []).join("\n")}
                                onChange={(e) =>
                                  updateVerification(
                                    sectionIndex,
                                    verificationIndex,
                                    "commands",
                                    e.target.value.split("\n"),
                                  )
                                }
                              />
                            </div>
                            <div>
                              <Label>Expected Output</Label>
                              <Textarea
                                value={(verification.expectedOutput || []).join(
                                  "\n",
                                )}
                                onChange={(e) =>
                                  updateVerification(
                                    sectionIndex,
                                    verificationIndex,
                                    "expectedOutput",
                                    e.target.value.split("\n"),
                                  )
                                }
                                rows={2}
                              />
                            </div>
                          </div>
                        </Card>
                      ),
                    )}
                  </TabsContent>
                </Tabs>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrev}>
            Previous: Environment
          </Button>
          <Button onClick={handleNext}>Next: Resources</Button>
        </div>
      </CardContent>
    </Card>
  );
}
