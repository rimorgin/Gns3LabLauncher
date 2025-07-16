"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Progress } from "@clnt/components/ui/progress";
import { Badge } from "@clnt/components/ui/badge";
import { Button } from "@clnt/components/ui/button";
import {
  CheckCircle,
  Clock,
  Play,
  BookOpen,
  Code,
  HelpCircle,
} from "lucide-react";
import type { LearningStep } from "@clnt/types/project";

interface LearningPathProps {
  steps: LearningStep[];
  currentStep: number;
  completedSteps: number[];
  onStepClick: (stepIndex: number) => void;
}

export function LearningPath({
  steps,
  currentStep,
  completedSteps,
  onStepClick,
}: LearningPathProps) {
  const getStepIcon = (type: string) => {
    const icons = {
      READING: BookOpen,
      LAB: Code,
      QUIZ: HelpCircle,
      PROJECT: Play,
    };
    const Icon = icons[type as keyof typeof icons] || BookOpen;
    return <Icon className="h-4 w-4" />;
  };

  const getStepColor = (type: string) => {
    const colors = {
      READING: "bg-blue-100 text-blue-800",
      LAB: "bg-green-100 text-green-800",
      QUIZ: "bg-yellow-100 text-yellow-800",
      PROJECT: "bg-purple-100 text-purple-800",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const progressPercentage = (completedSteps.length / steps.length) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Learning Path</CardTitle>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>
              {completedSteps.length}/{steps.length} completed
            </span>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => {
            const isCompleted = completedSteps.includes(index);
            const isCurrent = currentStep === index;
            const isLocked =
              index > 0 && !completedSteps.includes(index - 1) && !isCompleted;

            return (
              <div
                key={step.id}
                className={`border rounded-lg p-4 transition-all ${
                  isCurrent
                    ? "border-primary bg-primary/5"
                    : isCompleted
                      ? "border-green-200 bg-green-50"
                      : isLocked
                        ? "border-gray-200 bg-gray-50 opacity-60"
                        : "border-gray-200 hover:border-gray-300"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      isCompleted
                        ? "bg-green-500 text-white"
                        : isCurrent
                          ? "bg-primary text-primary-foreground"
                          : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {isCompleted ? (
                      <CheckCircle className="h-4 w-4" />
                    ) : (
                      <span className="text-sm font-medium">{index}</span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3
                        className={`font-medium ${isLocked ? "text-gray-400" : ""}`}
                      >
                        {step.title}
                      </h3>
                      <Badge className={getStepColor(step.type)}>
                        {getStepIcon(step.type)}
                        <span className="ml-1">{step.type}</span>
                      </Badge>
                    </div>

                    <p
                      className={`text-sm mb-3 ${isLocked ? "text-gray-400" : "text-muted-foreground"}`}
                    >
                      {step.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime} min
                        </div>
                        {step.prerequisites.length > 0 && (
                          <div>Prerequisites: {step.prerequisites.length}</div>
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant={
                          isCurrent
                            ? "default"
                            : isCompleted
                              ? "outline"
                              : "ghost"
                        }
                        onClick={() => onStepClick(index)}
                        disabled={isLocked}
                      >
                        {isCompleted
                          ? "Review"
                          : isCurrent
                            ? "Continue"
                            : "Start"}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
