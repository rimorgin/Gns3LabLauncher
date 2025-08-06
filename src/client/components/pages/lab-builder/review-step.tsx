"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { Separator } from "@clnt/components/ui/separator";
import {
  CheckCircle,
  Clock,
  BookOpen,
  Network,
  FileText,
  Save,
  Eye,
  Cog,
} from "lucide-react";
import type {
  Lab,
  LabEnvironment,
  LabGuide,
  LabResource,
  LabSettings,
} from "@clnt/types/lab";
import { IconFileTextShield, IconSandbox } from "@tabler/icons-react";

interface LabBuilderData {
  basicInfo: Partial<Lab>;
  environment: Partial<LabEnvironment>;
  guide: Partial<LabGuide>;
  resources: LabResource[];
  settings: Partial<LabSettings>;
}

interface ReviewStepProps {
  labData: LabBuilderData;
  onPrev: () => void;
  onPreview: (labData: LabBuilderData) => void;
  onTestLabEnvironment: (labData: LabBuilderData) => void;
  onSave: (labData: LabBuilderData) => void;
  onSaveDraft: (labData: LabBuilderData) => void;
  isLoading?: boolean;
}

export function ReviewStep({
  labData,
  onPrev,
  onPreview,
  onTestLabEnvironment,
  onSave,
  onSaveDraft,
  isLoading = false,
}: ReviewStepProps) {
  const { basicInfo, environment, guide, resources, settings } = labData;

  const handleTestLabEnvironment = () => {
    onTestLabEnvironment(labData);
  };

  const handlePreview = () => {
    onPreview(labData);
  };

  const handleSave = () => {
    onSave(labData);
  };

  const handleSaveDraft = () => {
    onSaveDraft(labData);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-yellow-100 text-yellow-800";
      case "ADVANCED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-5 h-5" />
          Review & Save Lab
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Basic Information Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Title</p>
              <p className="font-medium">
                {basicInfo.title || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium">
                {basicInfo.category || "Not specified"}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Difficulty</p>
              <Badge
                className={getDifficultyColor(
                  basicInfo.difficulty || "BEGINNER",
                )}
              >
                {basicInfo.difficulty || "BEGINNER"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Estimated Time</p>
              <p className="font-medium flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {basicInfo.estimatedTime || 60} minutes
              </p>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm text-gray-600">Description</p>
            <p className="text-sm">
              {basicInfo.description || "No description provided"}
            </p>
          </div>
          {basicInfo.tags && basicInfo.tags.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Tags</p>
              <div className="flex flex-wrap gap-2">
                {basicInfo.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Environment Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Network className="w-5 h-5" />
            Lab Environment
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Environment Type</p>
              <p className="font-medium">{environment.type || "GNS3"}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">
                Topology Nodes / Lab Devices
              </p>
              <p className="font-medium">
                {environment.topology?.nodes?.length || 0} nodes
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Network Links</p>
              <p className="font-medium">
                {environment.topology?.links?.length || 0} links
              </p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Guide Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Lab Guide
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Total Sections</p>
              <p className="font-medium">
                {guide.sections?.length || 0} sections
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Tasks</p>
              <p className="font-medium">
                {guide.sections?.reduce(
                  (total, section) => total + (section.tasks?.length || 0),
                  0,
                ) || 0}{" "}
                tasks
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Verification Steps</p>
              <p className="font-medium">
                {guide.sections?.reduce(
                  (total, section) =>
                    total + (section.verifications?.length || 0),
                  0,
                ) || 0}{" "}
                steps
              </p>
            </div>
          </div>
          {guide.sections && guide.sections.length > 0 && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">Sections Overview</p>
              <div className="space-y-2">
                {guide.sections.map((section, index) => (
                  <div
                    key={`${section.guideId}-${section.order}-${section.title}-${section.type}-index[${index}]`}
                    className="flex items-center justify-between p-2 border-1 rounded"
                  >
                    <div>
                      <span className="font-medium">
                        {index + 1}. {section.title}
                      </span>
                      <Badge variant="outline" className="ml-2">
                        {section.type}
                      </Badge>
                    </div>
                    <span className="text-sm text-gray-600">
                      {section.estimatedTime} min
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <Separator />

        {/* Resources Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Lab Resources
          </h3>
          <div className="mb-4">
            <p className="text-sm text-gray-600">Total Resources</p>
            <p className="font-medium">{resources.length} resources</p>
          </div>
          {resources.length > 0 && (
            <div className="space-y-2">
              {resources.map((resource, index) => (
                <div
                  key={`${resource.labId}-${resource.title}-${resource.type}-index[${index}]`}
                  className="flex items-center justify-between p-2 border-1 rounded"
                >
                  <div>
                    <span className="font-medium">{resource.title}</span>
                    <Badge variant="outline" className="ml-2">
                      {resource.type}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Lab Settings Review */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Cog className="w-5 h-5" />
            Lab Settings
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">
                Max Submission Attempts
              </span>
              <p className="font-medium">{settings.maxAttemptSubmission}</p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Force Exit Upon Timeout
              </span>
              <p className="font-medium">
                {settings.onForceExitUponTimeout ? "Enabled" : "Disabled"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">Interactive Lab</span>
              <p className="font-medium">
                {settings.disableInteractiveLab ? "Disabled" : "Enabled"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">
                Strictly no late submission
              </span>
              <p className="font-medium">
                {settings.noLateSubmission ? "Disabled" : "Enabled"}
              </p>
            </div>

            <div>
              <span className="text-muted-foreground">Visible to Students</span>
              <p className="font-medium">{settings.visible ? "Yes" : "No"}</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Action Buttons */}
        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={onPrev} disabled={isLoading}>
            Previous: Lab Settings
          </Button>
          <div className="space-x-2">
            <Button
              variant="outline"
              onClick={handleTestLabEnvironment}
              disabled={isLoading}
            >
              <IconSandbox className="w-4 h-4 mr-2" />
              Test Build Lab Environment
            </Button>
            <Button
              variant="outline"
              onClick={handlePreview}
              disabled={isLoading}
            >
              <Eye className="w-4 h-4 mr-2" />
              Quick Preview Lab
            </Button>
            <Button
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isLoading}
            >
              <IconFileTextShield className="w-4 h-4 mr-2" />
              Save as Draft
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Publishing Lab...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Publish Lab
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
