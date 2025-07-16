"use client";

import type React from "react";

import type { LabTemplate, TemplateVariable } from "@clnt/types/lab-template";
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
import { Textarea } from "@clnt/components/ui/textarea";
import { Switch } from "@clnt/components/ui/switch";

interface TemplateVariablesEditorProps {
  template: LabTemplate;
  setTemplate: React.Dispatch<React.SetStateAction<LabTemplate>>;
}

export function TemplateVariablesEditor({
  template,
  setTemplate,
}: TemplateVariablesEditorProps) {
  const [newVariable, setNewVariable] = useState<TemplateVariable>({
    name: "",
    type: "string",
    defaultValue: "",
    description: "",
    required: false,
  });

  const handleVariableChange = (
    index: number,
    field: keyof TemplateVariable,
    value: string | number | boolean,
  ) => {
    const updatedVariables = template.variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable,
    );
    setTemplate((prev) => ({ ...prev, variables: updatedVariables }));
  };

  const handleNewVariableChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setNewVariable((prev) => ({ ...prev, [name]: value }));
  };

  const handleNewVariableTypeChange = (value: TemplateVariable["type"]) => {
    setNewVariable((prev) => ({ ...prev, type: value, defaultValue: "" }));
  };

  const handleNewVariableRequiredChange = (checked: boolean) => {
    setNewVariable((prev) => ({ ...prev, required: checked }));
  };

  const addVariable = () => {
    if (newVariable.name && newVariable.type) {
      setTemplate((prev) => ({
        ...prev,
        variables: [...prev.variables, { ...newVariable }],
      }));
      setNewVariable({
        name: "",
        type: "string",
        defaultValue: "",
        description: "",
        required: false,
      });
    }
  };

  const removeVariable = (index: number) => {
    setTemplate((prev) => ({
      ...prev,
      variables: prev.variables.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="grid gap-6">
      <div className="grid gap-4">
        <Label>Customizable Variables</Label>
        <div className="space-y-4">
          {template.variables.map((variable, index) => (
            <Card key={index} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor={`var-name-${index}`}>Name</Label>
                  <Input
                    id={`var-name-${index}`}
                    value={variable.name}
                    onChange={(e) =>
                      handleVariableChange(index, "name", e.target.value)
                    }
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`var-type-${index}`}>Type</Label>
                  <Select
                    value={variable.type}
                    onValueChange={(value: TemplateVariable["type"]) =>
                      handleVariableChange(index, "type", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">String</SelectItem>
                      <SelectItem value="number">Number</SelectItem>
                      <SelectItem value="ip">IP Address</SelectItem>
                      <SelectItem value="subnet">Subnet Mask</SelectItem>
                      <SelectItem value="boolean">Boolean</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor={`var-default-${index}`}>Default Value</Label>
                  <Input
                    id={`var-default-${index}`}
                    value={variable.defaultValue}
                    onChange={(e) =>
                      handleVariableChange(
                        index,
                        "defaultValue",
                        e.target.value,
                      )
                    }
                  />
                </div>
                <div className="flex items-center space-x-2 col-span-full">
                  <Switch
                    id={`var-required-${index}`}
                    checked={variable.required}
                    onCheckedChange={(checked) =>
                      handleVariableChange(index, "required", checked)
                    }
                  />
                  <Label htmlFor={`var-required-${index}`}>Required</Label>
                </div>
              </div>
              <div className="grid gap-2 mt-4">
                <Label htmlFor={`var-description-${index}`}>Description</Label>
                <Textarea
                  id={`var-description-${index}`}
                  value={variable.description}
                  onChange={(e) =>
                    handleVariableChange(index, "description", e.target.value)
                  }
                  rows={2}
                />
              </div>
              <Button
                variant="destructive"
                size="sm"
                className="mt-4"
                onClick={() => removeVariable(index)}
              >
                <TrashIcon className="h-4 w-4 mr-2" /> Remove Variable
              </Button>
            </Card>
          ))}
        </div>

        <Card className="p-4 border-dashed border-2">
          <h3 className="text-lg font-semibold mb-4">Add New Variable</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="new-var-name">Name</Label>
              <Input
                id="new-var-name"
                name="name"
                value={newVariable.name}
                onChange={handleNewVariableChange}
                placeholder="e.g., RouterIP"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-var-type">Type</Label>
              <Select
                value={newVariable.type}
                onValueChange={handleNewVariableTypeChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">String</SelectItem>
                  <SelectItem value="number">Number</SelectItem>
                  <SelectItem value="ip">IP Address</SelectItem>
                  <SelectItem value="subnet">Subnet Mask</SelectItem>
                  <SelectItem value="boolean">Boolean</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="new-var-default">Default Value</Label>
              <Input
                id="new-var-default"
                name="defaultValue"
                value={newVariable.defaultValue}
                onChange={handleNewVariableChange}
                placeholder="e.g., 192.168.1.1"
              />
            </div>
            <div className="flex items-center space-x-2 col-span-full">
              <Switch
                id="new-var-required"
                checked={newVariable.required}
                onCheckedChange={handleNewVariableRequiredChange}
              />
              <Label htmlFor="new-var-required">Required</Label>
            </div>
          </div>
          <div className="grid gap-2 mt-4">
            <Label htmlFor="new-var-description">Description</Label>
            <Textarea
              id="new-var-description"
              name="description"
              value={newVariable.description}
              onChange={handleNewVariableChange}
              rows={2}
              placeholder="A brief explanation of this variable's purpose."
            />
          </div>
          <Button onClick={addVariable} className="mt-4">
            <PlusIcon className="h-4 w-4 mr-2" /> Add Variable
          </Button>
        </Card>
      </div>
    </div>
  );
}
