"use client";

import { useState } from "react";
import type { LabTemplate } from "@clnt/types/lab-template";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { TemplateBasicInfo } from "./template-basic-info";
import { TemplateEnvironmentEditor } from "./template-environment-editor";
import { TemplateGuideEditor } from "./template-guide-editor";
import { TemplateVariablesEditor } from "./template-variables-editor";
import { TemplateResourcesEditor } from "./template-resources-editor";
import { TemplateAccessInfoEditor } from "./template-access-info-editor";
import { toast } from "sonner";
import { useModal } from "@clnt/hooks/use-modal";
import { TemplatePreview } from "../lab-templates/template-preview";

export function TemplateEditor() {
  const [template, setTemplate] = useState<LabTemplate>({
    id: "", // Will be generated on save
    title: "", // Changed from name
    description: "",
    category: "Networking Fundamentals", // Default category
    difficulty: "BEGINNER",
    estimatedTime: 60,
    tags: [],
    thumbnail: "",
    objectives: [],
    prerequisites: [],
    environment: {
      // Nested environment
      id: "",
      type: "GNS3",
      topology: {
        nodes: [],
        links: [],
        layout: {
          width: 800,
          height: 600,
        },
      },
      devices: [],
      connections: [],
      startupConfig: "",
    },
    guide: {
      // Updated guide structure
      id: "",
      sections: [],
      currentSection: 0,
      completedSections: [],
    },
    resources: [], // Changed from resourceTemplates
    variables: [],
    isPublic: false,
    authorId: "current-user-id", // Placeholder
    createdAt: new Date(),
    updatedAt: new Date(),
    usageCount: 0,
  });

  const { isOpen, openModal, closeModal } = useModal();

  const handleSave = () => {
    // In a real application, you would send this data to a server
    console.log("Saving template:", template);
    toast.info("Template Saved!", {
      description: `Template "${template.title}" has been saved.`,
    });
    // You might redirect or clear the form here
  };

  return (
    <>
      <TemplatePreview
        isOpen={isOpen}
        onClose={closeModal}
        template={template}
        onUseTemplate={handleSave}
        key={template.id}
      />
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateBasicInfo template={template} setTemplate={setTemplate} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab Environment</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateEnvironmentEditor
              template={template}
              setTemplate={setTemplate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab Guide</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateGuideEditor
              template={template}
              setTemplate={setTemplate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customizable Variables</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateVariablesEditor
              template={template}
              setTemplate={setTemplate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Lab Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateResourcesEditor
              template={template}
              setTemplate={setTemplate}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Access Information</CardTitle>
          </CardHeader>
          <CardContent>
            <TemplateAccessInfoEditor
              template={template}
              setTemplate={setTemplate}
            />
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button onClick={handleSave}>Save Template</Button>
          <Button variant={"outline"} onClick={openModal}>
            Preview Template
          </Button>
        </div>
      </div>
    </>
  );
}
