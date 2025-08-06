"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Switch } from "@clnt/components/ui/switch";
import { FileText } from "lucide-react";
import type { LabSettings } from "@clnt/types/lab";
import { useImmer } from "use-immer";

interface SettingsStepProps {
  data: Partial<LabSettings>;
  onUpdate: (data: Partial<LabSettings>) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function SettingsStep({
  data,
  onUpdate,
  onNext,
  onPrev,
}: SettingsStepProps) {
  const [settings, setSettings] = useImmer<LabSettings>({
    labId: data?.labId ?? undefined,
    maxAttemptSubmission: data?.maxAttemptSubmission ?? 3,
    onForceExitUponTimeout: data?.onForceExitUponTimeout ?? false,
    disableInteractiveLab: data?.disableInteractiveLab ?? false,
    noLateSubmission: data?.noLateSubmission ?? false,
    visible: data?.visible ?? true,
  });

  const handleChange = <K extends keyof LabSettings>(
    field: K,
    value: LabSettings[K],
  ) => {
    setSettings((draft) => {
      draft[field] = value;
    });
  };

  const handleNext = () => {
    onUpdate(settings);
    onNext();
  };

  const handlePrev = () => {
    onUpdate(settings);
    onPrev();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5" />
          Lab Settings
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-4 border p-4 rounded-lg">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-20">
            <div className="col-span-1">
              <Label htmlFor="maxAttempts">Max Submission Attempts</Label>
              <Input
                id="maxAttempts"
                type="number"
                min={1}
                value={settings.maxAttemptSubmission}
                onChange={(e) =>
                  handleChange(
                    "maxAttemptSubmission",
                    Math.max(1, Number(e.target.value) || 1),
                  )
                }
              />
            </div>

            <div className="">
              <div>
                <Label>Strictly No Late Submission</Label>
                <p className="text-muted-foreground text-sm">
                  Tick to enable if you want to strictly reject late submissions
                </p>
              </div>
              <Switch
                checked={settings.noLateSubmission}
                onCheckedChange={(value) =>
                  handleChange("noLateSubmission", value)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Force Exit Upon Timeout</Label>
                <p className="text-muted-foreground text-sm">
                  Tick to force exit lab instance upon timeout
                </p>
              </div>
              <Switch
                checked={settings.onForceExitUponTimeout}
                onCheckedChange={(value) =>
                  handleChange("onForceExitUponTimeout", value)
                }
              />
            </div>

            <div className="flex items-start justify-between ">
              <div>
                <Label>Disable Interactive Lab</Label>
                <p className="text-muted-foreground text-sm">
                  Tick to disable if you want the study guide to be read only
                  material
                </p>
              </div>
              <Switch
                checked={settings.disableInteractiveLab}
                onCheckedChange={(value) =>
                  handleChange("disableInteractiveLab", value)
                }
              />
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <Label>Visible to Students</Label>
                <p className="text-muted-foreground text-sm">
                  Untick to disable set the lab invisible
                </p>
              </div>
              <Switch
                checked={settings.visible}
                onCheckedChange={(value) => handleChange("visible", value)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between pt-6">
          <Button variant="outline" onClick={handlePrev}>
            Previous: Lab Resources
          </Button>
          <Button onClick={handleNext}>Next: Review & Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
