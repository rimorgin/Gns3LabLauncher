"use client";

import { useState, useCallback } from "react";
import { Card, CardHeader, CardTitle } from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { CheckCircle, Circle } from "lucide-react";
import { BasicInfoStep } from "./basic-info-step";
import { EnvironmentStep } from "./environment-step";
import { GuideStep } from "./guide-step";
import { ResourcesStep } from "./resources-step";
import { ReviewStep } from "./review-step";
import type { Lab } from "@clnt/types/lab";
import { toast } from "sonner";
import { useCreateLab } from "@clnt/lib/mutations/lab/lab-create-mutation";
import { useUser } from "@clnt/lib/auth";
import { LabPreview } from "./lab-preview";
import { SettingsStep } from "./settings-step";
import router from "@clnt/pages/route-layout";
import { useLabBuilderStore } from "@clnt/lib/store/lab-builder-store";

export const steps = [
  {
    id: 1,
    title: "Basic Information",
    description: "Lab details and metadata",
  },
  {
    id: 2,
    title: "Environment Setup",
    description: "Network topology and devices",
  },
  { id: 3, title: "Lab Guide", description: "Step-by-step instructions" },
  {
    id: 4,
    title: "Resources",
    description: "Additional materials and references",
  },
  {
    id: 5,
    title: "Settings",
    description: "Additional settings",
  },
  { id: 6, title: "Review & Save", description: "Final review and publish" },
];

export function LabBuilder() {
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(1);
  const labData = useLabBuilderStore((state) => state.lab);
  const updateLabData = useLabBuilderStore((state) => state.updateSection);
  const buildLab = useLabBuilderStore((s) => s.buildLab);
  //const resetLab = useLabBuilderStore((s) => s.resetLab);
  //const storeLabData = useLabBuilderStore((state) => state.setLab);

  // Add state for preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewLab, setPreviewLab] = useState<Lab | null>(null);

  const createLab = useCreateLab();

  // Handle lab previewoh
  const handlePreview = useCallback(() => {
    const lab = buildLab(user.data?.username);
    setPreviewLab(lab);
    setShowPreview(true);
  }, [user.data?.username]);

  // Handle lab publishing
  const handleSaveLab = useCallback(async () => {
    const lab = buildLab(user.data?.username);
    lab.status = "PUBLISHED";

    return toast.promise(createLab.mutateAsync(lab), {
      loading: "Publishing lab...",
      success: "Lab published successfully",
      error: "Failed to publish lab",
    });
  }, [createLab, user.data?.username]);

  const handleTestLabEnvironment = useCallback(() => {
    const lab = buildLab(user.data?.username);
    console.log("🚀 ~ LabBuilder ~ lab:", lab);
    router.navigate("/lab-builder/test-build", {
      state: {
        from: router.state.location.pathname, // current route path before navigating
        step: currentStep, // track current step
      },
    });
  }, [user.data?.username]);

  // Handle draft saving
  const handleSaveDraftLab = useCallback(async () => {
    const lab = buildLab(user.data?.username);
    lab.status = "DRAFT";

    return toast.promise(createLab.mutateAsync(lab), {
      loading: "Saving draft...",
      success: "Draft saved successfully",
      error: "Failed to save draft",
    });
  }, [createLab, user.data?.username]);

  const nextStep = useCallback(() => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  }, [currentStep]);

  const prevStep = useCallback(() => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }, [currentStep]);

  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;
  /* 
  // Reset on load
  useEffect(() => {
    resetLab();
  }, []); */

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoStep
            data={labData.basicInfo}
            onUpdate={(data) => updateLabData("basicInfo", data)}
            onNext={nextStep}
          />
        );
      case 2:
        return (
          <EnvironmentStep
            data={labData.environment}
            onUpdate={(data) => updateLabData("environment", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 3:
        return (
          <GuideStep
            data={labData.guide}
            onUpdate={(data) => updateLabData("guide", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 4:
        return (
          <ResourcesStep
            data={labData.resources}
            onUpdate={(data) => updateLabData("resources", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 5:
        return (
          <SettingsStep
            data={labData.settings}
            onUpdate={(data) => updateLabData("settings", data)}
            onNext={nextStep}
            onPrev={prevStep}
          />
        );
      case 6:
        return (
          <ReviewStep
            labData={labData}
            onPrev={prevStep}
            onPreview={handlePreview}
            onTestLabEnvironment={handleTestLabEnvironment}
            onSave={handleSaveLab}
            onSaveDraft={handleSaveDraftLab}
            isLoading={createLab.isPending}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-full mx-auto">
      {/* Progress Header */}
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle>
              Step {currentStep} of {steps.length}
            </CardTitle>
            <span className="text-sm text-gray-500">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress
            value={progress}
            indicatorColor={"success"}
            className="mb-4"
          />
          <div className="flex items-center justify-around space-x-4 overflow-x-auto">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center space-x-2 min-w-0 ${
                  step.id === currentStep
                    ? "text-blue-600"
                    : step.id < currentStep
                      ? "text-green-600"
                      : "text-gray-400"
                }`}
              >
                {step.id < currentStep ? (
                  <CheckCircle className="w-5 h-5 flex-shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 flex-shrink-0" />
                )}
                <div className="min-w-0">
                  <p className="font-medium text-sm truncate">{step.title}</p>
                  <p className="text-xs text-gray-500 truncate">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardHeader>
      </Card>
      {/* Step Content */}
      {renderStep()}
      {showPreview && previewLab && (
        <LabPreview
          lab={previewLab}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          onLaunchLab={(lab) => {
            console.log("Launching lab:", lab.title);
            setShowPreview(false);
          }}
          onEditLab={(lab) => {
            console.log("Editing lab:", lab.title);
            setShowPreview(false);
          }}
        />
      )}
    </div>
  );
}
