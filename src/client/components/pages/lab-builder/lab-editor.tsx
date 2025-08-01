"use client";

import { useState, useCallback, useEffect } from "react";
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
import { useUpdateLab } from "@clnt/lib/mutations/lab/lab-update-mutation";
import { useUser } from "@clnt/lib/auth";
import { LabPreview } from "./lab-preview";
import { steps } from "./lab-builder";
import { SettingsStep } from "./settings-step";
import router from "@clnt/pages/route-layout";
import {
  LabBuilderData,
  useLabBuilderStore,
} from "@clnt/lib/store/lab-builder-store";
interface LabEditorProps {
  initialLab: LabBuilderData;
}

export function LabEditor({ initialLab }: LabEditorProps) {
  const user = useUser();
  const [currentStep, setCurrentStep] = useState(1); // start at Review by default

  const hasHydrated = useLabBuilderStore((state) => state.hasHydrated);
  const labData = useLabBuilderStore((state) => state.lab);
  const updateLabData = useLabBuilderStore((s) => s.updateSection);
  const buildLab = useLabBuilderStore((s) => s.buildLab);

  // Add state for preview
  const [showPreview, setShowPreview] = useState(false);
  const [previewLab, setPreviewLab] = useState<Lab | null>(null);

  const updateLab = useUpdateLab();

  useEffect(() => {
    if (hasHydrated) {
      console.log("hydrated labData", labData);
    }
  }, [hasHydrated, labData]);

  // Handle lab preview
  const handlePreview = useCallback(() => {
    const lab = buildLab(user.data?.username);
    setPreviewLab(lab);
    setShowPreview(true);
  }, [user.data?.username]);

  const handleTestLabEnvironment = useCallback(() => {
    const lab = buildLab(user.data?.username);
    router.navigate("/lab-builder/test-build", {
      state: {
        lab,
        from: router.state.location.pathname, // current route path before navigating
      },
      fromRouteId: "/lab-builder/editor",
    });
  }, [user.data?.username]);

  // Handle lab publishing
  const handleSaveLab = useCallback(async () => {
    const lab = buildLab(user.data?.username);
    lab.status = "PUBLISHED";

    return toast.promise(updateLab.mutateAsync({ id: lab.id, data: lab }), {
      loading: "Publishing lab...",
      success: "Lab published successfully",
      error: "Failed to publish lab",
    });
  }, [updateLab, user.data?.username]);

  // Handle draft saving
  const handleSaveDraftLab = useCallback(async () => {
    const lab = buildLab(user.data?.username);
    lab.status = "DRAFT";

    console.log("🚀 ~ lab:", lab);

    return toast.promise(updateLab.mutateAsync({ id: lab.id, data: lab }), {
      loading: "Saving draft...",
      success: "Draft saved successfully",
      error: "Failed to save draft",
    });
  }, [updateLab, user.data?.username]);

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

  if (!hasHydrated) {
    return null;
  }

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
            isLoading={updateLab.isPending}
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
            <span className="text-sm text-muted-foreground">
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
                  <p className="text-xs truncate">{step.description}</p>
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
