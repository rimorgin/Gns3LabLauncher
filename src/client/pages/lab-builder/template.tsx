"use client";

import { useState } from "react";
import { Plus, BookOpen, Users, Clock } from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Badge } from "@clnt/components/ui/badge";
import { TemplateBrowser } from "@clnt/components/pages/lab/lab-templates/template-browser";
import { TemplatePreview } from "@clnt/components/pages/lab/lab-templates/template-preview";
import { TemplateCustomizer } from "@clnt/components/pages/lab/lab-templates/template-customizer";
import type { LabTemplate } from "@clnt/types/lab-template";
import { templateCategories } from "@clnt/constants/data";

type ViewMode = "browse" | "preview" | "customize";

export default function LabTemplatesPageRoute() {
  const [viewMode, setViewMode] = useState<ViewMode>("browse");
  const [selectedTemplate, setSelectedTemplate] = useState<LabTemplate | null>(
    null,
  );

  const totalTemplates = templateCategories.reduce(
    (acc, category) => acc + category.templates.length,
    0,
  );
  const popularTemplates = templateCategories
    .flatMap((category) => category.templates)
    .sort((a, b) => b.usageCount - a.usageCount)
    .slice(0, 3);

  const handleSelectTemplate = (template: LabTemplate) => {
    setSelectedTemplate(template);
    setViewMode("customize");
  };

  const handlePreviewTemplate = (template: LabTemplate) => {
    setSelectedTemplate(template);
    setViewMode("preview");
  };

  const handleSaveCustomization = (
    customizedTemplate: LabTemplate,
    variables: Record<string, string>,
  ) => {
    // Here you would typically save the customized template and create a new lab
    console.log("Saving customized template:", customizedTemplate);
    console.log("With variables:", variables);

    // For now, just go back to browse mode
    setViewMode("browse");
    setSelectedTemplate(null);

    // In a real app, you might redirect to the new lab or show a success message
  };

  const handleBackToBrowse = () => {
    setViewMode("browse");
    setSelectedTemplate(null);
  };

  const handlePreviewFromCustomizer = () => {
    if (selectedTemplate) {
      setViewMode("preview");
    }
  };

  if (viewMode === "customize" && selectedTemplate) {
    return (
      <TemplateCustomizer
        template={selectedTemplate}
        onSave={handleSaveCustomization}
        onBack={handleBackToBrowse}
        onPreview={handlePreviewFromCustomizer}
      />
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Lab Templates</h1>
          <p className="text-muted-foreground mt-2">
            Choose from pre-built templates to quickly create networking labs
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Custom Template
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Templates
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTemplates}</div>
            <p className="text-xs text-muted-foreground">
              Across {templateCategories.length} categories
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Most Popular</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {popularTemplates[0]?.usageCount || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {popularTemplates[0]?.title || "No data"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Duration</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(
                templateCategories
                  .flatMap((category) => category.templates)
                  .reduce((acc, template) => acc + template.estimatedTime, 0) /
                  totalTemplates,
              )}
              min
            </div>
            <p className="text-xs text-muted-foreground">
              Average lab duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {templateCategories.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Different skill areas
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Featured Templates */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Featured Templates</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularTemplates.map((template) => (
            <Card
              key={template.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{template.title}</CardTitle>
                    <CardDescription className="mt-1">
                      {template.description}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{template.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {template.estimatedTime}min
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {template.usageCount} uses
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={() => handleSelectTemplate(template)}
                  >
                    Use Template
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handlePreviewTemplate(template)}
                  >
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Template Browser */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">All Templates</h2>
        <TemplateBrowser
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      </div>

      {/* Template Preview Modal */}
      <TemplatePreview
        template={selectedTemplate}
        isOpen={viewMode === "preview"}
        onClose={handleBackToBrowse}
        onUseTemplate={handleSelectTemplate}
      />
    </div>
  );
}
