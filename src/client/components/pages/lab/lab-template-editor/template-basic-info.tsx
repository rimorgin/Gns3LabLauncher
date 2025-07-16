"use client";

import type React from "react";

import type { LabTemplate } from "@clnt/types/lab-template";
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

interface TemplateBasicInfoProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateBasicInfo({
  template,
  setTemplate,
}: TemplateBasicInfoProps) {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTemplate((prev) => ({ ...prev, [name]: Number(value) }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setTemplate((prev) => ({ ...prev, [name]: value }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      tags: value.split(",").map((tag) => tag.trim()),
    }));
  };

  const handleObjectivesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      objectives: value
        .split("\n")
        .map((obj) => obj.trim())
        .filter(Boolean),
    }));
  };

  const handlePrerequisitesChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setTemplate((prev) => ({
      ...prev,
      prerequisites: value
        .split("\n")
        .map((pre) => pre.trim())
        .filter(Boolean),
    }));
  };

  const handlePublicChange = (checked: boolean) => {
    setTemplate((prev) => ({ ...prev, isPublic: checked }));
  };

  return (
    <div className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="title">Template Name</Label>
        <Input
          id="title"
          name="title" // Changed from name
          value={template.title} // Changed from name
          onChange={handleChange}
          placeholder="e.g., Basic Router Configuration"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          value={template.description}
          onChange={handleChange}
          placeholder="A brief description of the lab template"
          rows={3}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="category">Category</Label>
          <Select
            name="category"
            value={template.category}
            onValueChange={(value) => handleSelectChange("category", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Networking Fundamentals">
                Networking Fundamentals
              </SelectItem>
              <SelectItem value="Switching">Switching</SelectItem>
              <SelectItem value="Routing Protocols">
                Routing Protocols
              </SelectItem>
              <SelectItem value="Security">Security</SelectItem>
              <SelectItem value="WAN Technologies">WAN Technologies</SelectItem>
              <SelectItem value="Wireless">Wireless</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            name="difficulty"
            value={template.difficulty}
            onValueChange={(value) => handleSelectChange("difficulty", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BEGINNER">Beginner</SelectItem>
              <SelectItem value="INTERMEDIATE">Intermediate</SelectItem>
              <SelectItem value="ADVANCED">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="grid gap-2">
          <Label htmlFor="estimatedTime">Estimated Time (minutes)</Label>
          <Input
            id="estimatedTime"
            name="estimatedTime"
            type="number"
            value={template.estimatedTime}
            onChange={handleNumberChange}
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            name="tags"
            value={template.tags.join(", ")}
            onChange={handleTagsChange}
            placeholder="e.g., Cisco, Routing, OSPF"
          />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="thumbnail">Thumbnail URL</Label>
        <Input
          id="thumbnail"
          name="thumbnail"
          value={template.thumbnail}
          onChange={handleChange}
          placeholder="e.g., https://example.com/thumbnail.png"
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="objectives">Objectives (one per line)</Label>
        <Textarea
          id="objectives"
          name="objectives"
          value={template.objectives.join("\n")}
          onChange={handleObjectivesChange}
          placeholder="List key learning objectives"
          rows={4}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="prerequisites">Prerequisites (one per line)</Label>
        <Textarea
          id="prerequisites"
          name="prerequisites"
          value={template.prerequisites.join("\n")}
          onChange={handlePrerequisitesChange}
          placeholder="List required knowledge or tools"
          rows={4}
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="isPublic"
          checked={template.isPublic}
          onCheckedChange={handlePublicChange}
        />
        <Label htmlFor="isPublic">Make Public</Label>
      </div>
    </div>
  );
}
