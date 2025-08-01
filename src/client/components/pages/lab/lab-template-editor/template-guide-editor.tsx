"use client";

import type React from "react";

import type { LabTemplate } from "@clnt/types/lab-template";
import type {
  LabSection,
  LabContent,
  LabTask,
  VerificationStep,
} from "@clnt/types/lab";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Textarea } from "@clnt/components/ui/textarea";
import { Button } from "@clnt/components/ui/button";
import { PlusIcon, TrashIcon } from "lucide-react";
import { useState } from "react";
import { Card } from "@clnt/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@clnt/components/ui/select";

interface TemplateGuideEditorProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateGuideEditor({
  template,
  setTemplate,
}: TemplateGuideEditorProps) {
  const [newSection, setNewSection] = useState<LabSection>({
    id: "",
    title: "",
    type: "step",
    order: 0,
    estimatedTime: 0,
    content: [],
    tasks: [],
    verifications: [],
    hints: [],
  });
  const [newContent, setNewContent] = useState<LabContent>({
    id: "",
    type: "text",
    content: "",
  });
  const [newTask, setNewTask] = useState<LabTask>({
    id: "",
    description: "",
    isCompleted: false,
    hints: [],
  });
  const [newVerification, setNewVerification] = useState<VerificationStep>({
    id: "",
    description: "",
    commands: [],
    expectedOutput: [],
    device: "",
    isCompleted: false,
  });
  const [newHint, setNewHint] = useState<string>("");

  const handleGuideIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, id: e.target.value },
    }));
  };

  const handleSectionChange = (
    sectionIndex: number,
    field: keyof LabSection,
    value: any,
  ) => {
    const updatedSections = template.guide.sections.map((section, i) =>
      i === sectionIndex ? { ...section, [field]: value } : section,
    );
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  const handleNewSectionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({
      ...prev,
      [name]:
        name === "order" || name === "estimatedTime" ? Number(value) : value,
    }));
  };

  const handleNewSectionTypeChange = (value: LabSection["type"]) => {
    setNewSection((prev) => ({ ...prev, type: value }));
  };

  const addSection = () => {
    if (newSection.title && newSection.type) {
      setTemplate((prev) => ({
        ...prev,
        guide: {
          ...prev.guide,
          sections: [
            ...prev.guide.sections,
            { ...newSection, id: `section-${Date.now()}` },
          ],
        },
      }));
      setNewSection({
        id: "",
        title: "",
        type: "step",
        order: 0,
        estimatedTime: 0,
        content: [],
        tasks: [],
        verifications: [],
        hints: [],
      });
    }
  };

  const removeSection = (id: string) => {
    setTemplate((prev) => ({
      ...prev,
      guide: {
        ...prev.guide,
        sections: prev.guide.sections.filter((section) => section.id !== id),
      },
    }));
  };

  // Content Handlers
  const handleContentChange = (
    sectionIndex: number,
    contentIndex: number,
    field: keyof LabContent,
    value: string,
  ) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedContent = section.content.map((content, cIdx) =>
          cIdx === contentIndex ? { ...content, [field]: value } : content,
        );
        return { ...section, content: updatedContent };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  const handleNewContentChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewContent((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewContentTypeChange = (value: LabContent["type"]) => {
    setNewContent((prev) => ({ ...prev, type: value }));
  };

  const addContent = (sectionIndex: number) => {
    if (newContent.content) {
      const updatedSections = template.guide.sections.map((section, sIdx) => {
        if (sIdx === sectionIndex) {
          return {
            ...section,
            content: [
              ...section.content,
              { ...newContent, id: `content-${Date.now()}` },
            ],
          };
        }
        return section;
      });
      setTemplate((prev) => ({
        ...prev,
        guide: { ...prev.guide, sections: updatedSections },
      }));
      setNewContent({ id: "", type: "text", content: "" });
    }
  };

  const removeContent = (sectionIndex: number, contentId: string) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...section,
          content: section.content.filter(
            (content) => content.id !== contentId,
          ),
        };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  // Task Handlers
  const handleTaskChange = (
    sectionIndex: number,
    taskIndex: number,
    field: keyof LabTask,
    value: any,
  ) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedTasks = section.tasks.map((task, tIdx) =>
          tIdx === taskIndex ? { ...task, [field]: value } : task,
        );
        return { ...section, tasks: updatedTasks };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  const handleNewTaskChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewTaskHintsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTask((prev) => ({
      ...prev,
      hints: e.target.value.split(",").map((h) => h.trim()),
    }));
  };

  const addTask = (sectionIndex: number) => {
    if (newTask.description) {
      const updatedSections = template.guide.sections.map((section, sIdx) => {
        if (sIdx === sectionIndex) {
          return {
            ...section,
            tasks: [...section.tasks, { ...newTask, id: `task-${Date.now()}` }],
          };
        }
        return section;
      });
      setTemplate((prev) => ({
        ...prev,
        guide: { ...prev.guide, sections: updatedSections },
      }));
      setNewTask({ id: "", description: "", isCompleted: false, hints: [] });
    }
  };

  const removeTask = (sectionIndex: number, taskId: string) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...section,
          tasks: section.tasks.filter((task) => task.id !== taskId),
        };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  // Verification Handlers
  const handleVerificationChange = (
    sectionIndex: number,
    verificationIndex: number,
    field: keyof VerificationStep,
    value: any,
  ) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedVerifications = section.verifications.map((v, vIdx) =>
          vIdx === verificationIndex ? { ...v, [field]: value } : v,
        );
        return { ...section, verification: updatedVerifications };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  const handleNewVerificationChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewVerification((prev) => ({ ...prev, [name]: value }));
  };

  const addVerification = (sectionIndex: number) => {
    if (newVerification.description && newVerification.commands) {
      const updatedSections = template.guide.sections.map((section, sIdx) => {
        if (sIdx === sectionIndex) {
          return {
            ...section,
            verification: [
              ...section.verifications,
              { ...newVerification, id: `verify-${Date.now()}` },
            ],
          };
        }
        return section;
      });
      setTemplate((prev) => ({
        ...prev,
        guide: { ...prev.guide, sections: updatedSections },
      }));
      setNewVerification({
        id: "",
        description: "",
        commands: [],
        expectedOutput: [],
        device: "",
        isCompleted: false,
      });
    }
  };

  const removeVerification = (sectionIndex: number, verificationId: string) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...section,
          verification: section.verifications.filter(
            (v) => v.id !== verificationId,
          ),
        };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  // Hint Handlers
  const handleHintChange = (
    sectionIndex: number,
    hintIndex: number,
    value: string,
  ) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        const updatedHints = section.hints.map((hint, hIdx) =>
          hIdx === hintIndex ? value : hint,
        );
        return { ...section, hints: updatedHints };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  const addHint = (sectionIndex: number) => {
    if (newHint) {
      const updatedSections = template.guide.sections.map((section, sIdx) => {
        if (sIdx === sectionIndex) {
          return { ...section, hints: [...section.hints, newHint] };
        }
        return section;
      });
      setTemplate((prev) => ({
        ...prev,
        guide: { ...prev.guide, sections: updatedSections },
      }));
      setNewHint("");
    }
  };

  const removeHint = (sectionIndex: number, hintIndex: number) => {
    const updatedSections = template.guide.sections.map((section, sIdx) => {
      if (sIdx === sectionIndex) {
        return {
          ...section,
          hints: section.hints.filter((_, hIdx) => hIdx !== hintIndex),
        };
      }
      return section;
    });
    setTemplate((prev) => ({
      ...prev,
      guide: { ...prev.guide, sections: updatedSections },
    }));
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        <Label htmlFor="guide-id">Guide ID</Label>
        <Input
          id="guide-id"
          value={template.guide.id}
          onChange={handleGuideIdChange}
          placeholder="e.g., basic-router-guide"
        />
      </div>

      <div className="grid gap-4">
        <Label>Guide Sections</Label>
        <div className="space-y-6">
          {template.guide.sections.map((section, sectionIndex) => (
            <Card key={section.id} className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">
                  Section {section.order}: {section.title}
                </h3>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => removeSection(section.id)}
                >
                  <TrashIcon className="h-4 w-4 mr-2" /> Remove Section
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`section-title-${sectionIndex}`}>Title</Label>
                  <Input
                    id={`section-title-${sectionIndex}`}
                    value={section.title}
                    onChange={(e) =>
                      handleSectionChange(sectionIndex, "title", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`section-type-${sectionIndex}`}>Type</Label>
                  <Select
                    value={section.type}
                    onValueChange={(value: LabSection["type"]) =>
                      handleSectionChange(sectionIndex, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
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
                <div className="grid gap-2">
                  <Label htmlFor={`section-order-${sectionIndex}`}>Order</Label>
                  <Input
                    id={`section-order-${sectionIndex}`}
                    type="number"
                    value={section.order}
                    onChange={(e) =>
                      handleSectionChange(
                        sectionIndex,
                        "order",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`section-estimatedTime-${sectionIndex}`}>
                    Estimated Time (min)
                  </Label>
                  <Input
                    id={`section-estimatedTime-${sectionIndex}`}
                    type="number"
                    value={section.estimatedTime}
                    onChange={(e) =>
                      handleSectionChange(
                        sectionIndex,
                        "estimatedTime",
                        Number(e.target.value),
                      )
                    }
                  />
                </div>
              </div>

              {/* Content */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold">Content Blocks</h4>
                {section.content.map((contentBlock, contentIndex) => (
                  <Card key={contentBlock.id} className="p-4 bg-muted/20">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`content-type-${sectionIndex}-${contentIndex}`}
                        >
                          Type
                        </Label>
                        <Select
                          value={contentBlock.type}
                          onValueChange={(value: LabContent["type"]) =>
                            handleContentChange(
                              sectionIndex,
                              contentIndex,
                              "type",
                              value,
                            )
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="text">Text</SelectItem>
                            <SelectItem value="code">Code</SelectItem>
                            <SelectItem value="image">Image</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                            <SelectItem value="callout">Callout</SelectItem>
                            <SelectItem value="topology">Topology</SelectItem>
                            <SelectItem value="terminal">Terminal</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid gap-2">
                        <Label
                          htmlFor={`content-content-${sectionIndex}-${contentIndex}`}
                        >
                          Content
                        </Label>
                        <Textarea
                          id={`content-content-${sectionIndex}-${contentIndex}`}
                          value={contentBlock.content}
                          onChange={(e) =>
                            handleContentChange(
                              sectionIndex,
                              contentIndex,
                              "content",
                              e.target.value,
                            )
                          }
                          rows={4}
                          placeholder="Enter content (e.g., Markdown, code, URL)"
                        />
                      </div>
                      {/* Simplified metadata editing for brevity */}
                      {contentBlock.type === "code" && (
                        <div className="grid gap-2 col-span-full">
                          <Label
                            htmlFor={`content-lang-${sectionIndex}-${contentIndex}`}
                          >
                            Language (for code)
                          </Label>
                          <Input
                            id={`content-lang-${sectionIndex}-${contentIndex}`}
                            value={contentBlock.metadata?.language || ""}
                            onChange={(e) =>
                              handleContentChange(
                                sectionIndex,
                                contentIndex,
                                "metadata",
                                {
                                  ...contentBlock.metadata,
                                  language: e.target.value,
                                },
                              )
                            }
                            placeholder="e.g., cisco, python"
                          />
                        </div>
                      )}
                      {contentBlock.type === "callout" && (
                        <div className="grid gap-2 col-span-full">
                          <Label
                            htmlFor={`content-callout-type-${sectionIndex}-${contentIndex}`}
                          >
                            Callout Type
                          </Label>
                          <Select
                            value={
                              contentBlock.metadata?.callout_type || "info"
                            }
                            onValueChange={(
                              value: LabContent["metadata"]["callout_type"],
                            ) =>
                              handleContentChange(
                                sectionIndex,
                                contentIndex,
                                "metadata",
                                {
                                  ...contentBlock.metadata,
                                  callout_type: value,
                                },
                              )
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select callout type" />
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
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() =>
                        removeContent(sectionIndex, contentBlock.id)
                      }
                    >
                      <TrashIcon className="h-4 w-4 mr-2" /> Remove Content
                      Block
                    </Button>
                  </Card>
                ))}
                <Card className="p-4 border-dashed border-2">
                  <h5 className="text-md font-semibold mb-4">
                    Add New Content Block
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="new-content-type">Type</Label>
                      <Select
                        value={newContent.type}
                        onValueChange={handleNewContentTypeChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="code">Code</SelectItem>
                          <SelectItem value="image">Image</SelectItem>
                          <SelectItem value="video">Video</SelectItem>
                          <SelectItem value="callout">Callout</SelectItem>
                          <SelectItem value="topology">Topology</SelectItem>
                          <SelectItem value="terminal">Terminal</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="new-content-content">Content</Label>
                      <Textarea
                        id="new-content-content"
                        name="content"
                        value={newContent.content}
                        onChange={handleNewContentChange}
                        rows={4}
                        placeholder="Enter content (e.g., Markdown, code, URL)"
                      />
                    </div>
                  </div>
                  <Button
                    onClick={() => addContent(sectionIndex)}
                    className="mt-4"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Content
                  </Button>
                </Card>
              </div>

              {/* Tasks */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold">Tasks</h4>
                {section.tasks.map((task, taskIndex) => (
                  <Card key={task.id} className="p-4 bg-muted/20">
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`task-description-${sectionIndex}-${taskIndex}`}
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`task-description-${sectionIndex}-${taskIndex}`}
                        value={task.description}
                        onChange={(e) =>
                          handleTaskChange(
                            sectionIndex,
                            taskIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`task-device-${sectionIndex}-${taskIndex}`}
                      >
                        Device (optional)
                      </Label>
                      <Input
                        id={`task-device-${sectionIndex}-${taskIndex}`}
                        value={task.device || ""}
                        onChange={(e) =>
                          handleTaskChange(
                            sectionIndex,
                            taskIndex,
                            "device",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Router1"
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`task-commands-${sectionIndex}-${taskIndex}`}
                      >
                        Commands (comma-separated)
                      </Label>
                      <Input
                        id={`task-commands-${sectionIndex}-${taskIndex}`}
                        value={task.commands?.join(", ") || ""}
                        onChange={(e) =>
                          handleTaskChange(
                            sectionIndex,
                            taskIndex,
                            "commands",
                            e.target.value.split(",").map((c) => c.trim()),
                          )
                        }
                        placeholder="e.g., enable, configure terminal"
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`task-expectedResult-${sectionIndex}-${taskIndex}`}
                      >
                        Expected Result
                      </Label>
                      <Input
                        id={`task-expectedResult-${sectionIndex}-${taskIndex}`}
                        value={task.expectedResult || ""}
                        onChange={(e) =>
                          handleTaskChange(
                            sectionIndex,
                            taskIndex,
                            "expectedResult",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Ping successful"
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`task-hints-${sectionIndex}-${taskIndex}`}
                      >
                        Hints (comma-separated)
                      </Label>
                      <Input
                        id={`task-hints-${sectionIndex}-${taskIndex}`}
                        value={task.hints.join(", ")}
                        onChange={(e) =>
                          handleTaskChange(
                            sectionIndex,
                            taskIndex,
                            "hints",
                            e.target.value.split(",").map((h) => h.trim()),
                          )
                        }
                        placeholder="e.g., Check IP, Verify subnet mask"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() => removeTask(sectionIndex, task.id)}
                    >
                      <TrashIcon className="h-4 w-4 mr-2" /> Remove Task
                    </Button>
                  </Card>
                ))}
                <Card className="p-4 border-dashed border-2">
                  <h5 className="text-md font-semibold mb-4">Add New Task</h5>
                  <div className="grid gap-2">
                    <Label htmlFor="new-task-description">Description</Label>
                    <Textarea
                      id="new-task-description"
                      name="description"
                      value={newTask.description}
                      onChange={handleNewTaskChange}
                      rows={2}
                      placeholder="e.g., Configure hostname on Router1"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-task-device">Device (optional)</Label>
                    <Input
                      id="new-task-device"
                      name="device"
                      value={newTask.device || ""}
                      onChange={handleNewTaskChange}
                      placeholder="e.g., Router1"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-task-commands">
                      Commands (comma-separated)
                    </Label>
                    <Input
                      id="new-task-commands"
                      value={newTask.commands?.join(", ") || ""}
                      onChange={handleNewTaskHintsChange} // Reusing for commands
                      placeholder="e.g., enable, configure terminal"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-task-expectedResult">
                      Expected Result
                    </Label>
                    <Input
                      id="new-task-expectedResult"
                      name="expectedResult"
                      value={newTask.expectedResult || ""}
                      onChange={handleNewTaskChange}
                      placeholder="e.g., Router prompt changes to R1"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-task-hints">
                      Hints (comma-separated)
                    </Label>
                    <Input
                      id="new-task-hints"
                      value={newTask.hints.join(", ")}
                      onChange={handleNewTaskHintsChange}
                      placeholder="e.g., Use 'hostname' command"
                    />
                  </div>
                  <Button
                    onClick={() => addTask(sectionIndex)}
                    className="mt-4"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Task
                  </Button>
                </Card>
              </div>

              {/* Verification Steps */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold">Verification Steps</h4>
                {section.verifications.map((verify, verifyIndex) => (
                  <Card key={verify.id} className="p-4 bg-muted/20">
                    <div className="grid gap-2">
                      <Label
                        htmlFor={`verify-description-${sectionIndex}-${verifyIndex}`}
                      >
                        Description
                      </Label>
                      <Textarea
                        id={`verify-description-${sectionIndex}-${verifyIndex}`}
                        value={verify.description}
                        onChange={(e) =>
                          handleVerificationChange(
                            sectionIndex,
                            verifyIndex,
                            "description",
                            e.target.value,
                          )
                        }
                        rows={2}
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`verify-command-${sectionIndex}-${verifyIndex}`}
                      >
                        Command
                      </Label>
                      <Input
                        id={`verify-command-${sectionIndex}-${verifyIndex}`}
                        value={verify.commands}
                        onChange={(e) =>
                          handleVerificationChange(
                            sectionIndex,
                            verifyIndex,
                            "commands",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., show ip interface brief"
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`verify-expectedOutput-${sectionIndex}-${verifyIndex}`}
                      >
                        Expected Output
                      </Label>
                      <Textarea
                        id={`verify-expectedOutput-${sectionIndex}-${verifyIndex}`}
                        value={verify.expectedOutput}
                        onChange={(e) =>
                          handleVerificationChange(
                            sectionIndex,
                            verifyIndex,
                            "expectedOutput",
                            e.target.value,
                          )
                        }
                        rows={3}
                        placeholder="e.g., GigabitEthernet0/0 is up, line protocol is up"
                      />
                    </div>
                    <div className="grid gap-2 mt-2">
                      <Label
                        htmlFor={`verify-device-${sectionIndex}-${verifyIndex}`}
                      >
                        Device
                      </Label>
                      <Input
                        id={`verify-device-${sectionIndex}-${verifyIndex}`}
                        value={verify.device}
                        onChange={(e) =>
                          handleVerificationChange(
                            sectionIndex,
                            verifyIndex,
                            "device",
                            e.target.value,
                          )
                        }
                        placeholder="e.g., Router1"
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="mt-4"
                      onClick={() =>
                        removeVerification(sectionIndex, verify.id)
                      }
                    >
                      <TrashIcon className="h-4 w-4 mr-2" /> Remove Verification
                    </Button>
                  </Card>
                ))}
                <Card className="p-4 border-dashed border-2">
                  <h5 className="text-md font-semibold mb-4">
                    Add New Verification Step
                  </h5>
                  <div className="grid gap-2">
                    <Label htmlFor="new-verify-description">Description</Label>
                    <Textarea
                      id="new-verify-description"
                      name="description"
                      value={newVerification.description}
                      onChange={handleNewVerificationChange}
                      rows={2}
                      placeholder="e.g., Verify interface status"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-verify-command">Command</Label>
                    <Input
                      id="new-verify-command"
                      name="command"
                      value={newVerification.commands}
                      onChange={handleNewVerificationChange}
                      placeholder="e.g., show ip interface brief"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-verify-expectedOutput">
                      Expected Output
                    </Label>
                    <Textarea
                      id="new-verify-expectedOutput"
                      name="expectedOutput"
                      value={newVerification.expectedOutput.join("\n")}
                      onChange={handleNewVerificationChange}
                      rows={3}
                      placeholder="e.g., GigabitEthernet0/0 is up, line protocol is up"
                    />
                  </div>
                  <div className="grid gap-2 mt-2">
                    <Label htmlFor="new-verify-device">Device</Label>
                    <Input
                      id="new-verify-device"
                      name="device"
                      value={newVerification.device}
                      onChange={handleNewVerificationChange}
                      placeholder="e.g., Router1"
                    />
                  </div>
                  <Button
                    onClick={() => addVerification(sectionIndex)}
                    className="mt-4"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Verification
                  </Button>
                </Card>
              </div>

              {/* Hints */}
              <div className="mt-6 space-y-4">
                <h4 className="text-md font-semibold">Hints</h4>
                {section.hints.map((hint, hintIndex) => (
                  <Card
                    key={hintIndex}
                    className="p-4 bg-muted/20 flex justify-between items-center"
                  >
                    <span>{hint}</span>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeHint(sectionIndex, hintIndex)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </Card>
                ))}
                <Card className="p-4 border-dashed border-2">
                  <h5 className="text-md font-semibold mb-4">Add New Hint</h5>
                  <div className="grid gap-2">
                    <Label htmlFor="new-hint">Hint Text</Label>
                    <Input
                      id="new-hint"
                      value={newHint}
                      onChange={(e) => setNewHint(e.target.value)}
                      placeholder="e.g., Remember to use 'no shutdown'"
                    />
                  </div>
                  <Button
                    onClick={() => addHint(sectionIndex)}
                    className="mt-4"
                  >
                    <PlusIcon className="h-4 w-4 mr-2" /> Add Hint
                  </Button>
                </Card>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Section</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-section-title">Section Title</Label>
              <Input
                id="new-section-title"
                name="title"
                value={newSection.title}
                onChange={handleNewSectionChange}
                placeholder="e.g., Step 1: Configure Router Interfaces"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-section-type">Type</Label>
              <Select
                value={newSection.type}
                onValueChange={handleNewSectionTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
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
            <div className="grid gap-2">
              <Label htmlFor="new-section-order">Order</Label>
              <Input
                id="new-section-order"
                name="order"
                type="number"
                value={newSection.order}
                onChange={handleNewSectionChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-section-estimatedTime">
                Estimated Time (min)
              </Label>
              <Input
                id="new-section-estimatedTime"
                name="estimatedTime"
                type="number"
                value={newSection.estimatedTime}
                onChange={handleNewSectionChange}
              />
            </div>
          </div>
          <Button onClick={addSection} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Section
          </Button>
        </Card>
      </div>
    </div>
  );
}
