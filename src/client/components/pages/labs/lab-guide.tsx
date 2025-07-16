"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import { Separator } from "@clnt/components/ui/separator";
import {
  Play,
  Terminal,
  FileText,
  CheckCircle,
  AlertTriangle,
  Info,
  Copy,
  ExternalLink,
} from "lucide-react";
import { LabSubmission } from "./lab-submission";
import { SubmissionStatus } from "./submission-status";
import { useState } from "react";
import type { Submission } from "@clnt/types/project";
import { capitalizeFirstLetter } from "@clnt/lib/utils";

interface LabGuideProps {
  labTitle: string;
  labType: "READING" | "QUIZ" | "LAB" | "PROJECT";
  objectives: string[];
  prerequisites: string[];
  estimatedTime: number;
  difficulty: "BEGINNER" | "INTERMEDIATE" | "ADVANCED";
  projectId: string;
  userId: string;
  onLaunchLab: () => void;
}

export function LabGuide({
  labTitle,
  labType,
  objectives,
  prerequisites,
  estimatedTime,
  difficulty,
  projectId,
  userId,
  onLaunchLab,
}: LabGuideProps) {
  const getDifficultyColor = (level: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[level as keyof typeof colors];
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const [showSubmission, setShowSubmission] = useState(false);
  const [submission, setSubmission] = useState<Submission | null>(null);

  const handleSubmissionUpdate = (updatedSubmission: Submission) => {
    setSubmission(updatedSubmission);
    setShowSubmission(false);
  };

  return (
    <div className="space-y-6">
      {/* Lab Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{labTitle}</CardTitle>
              <div className="flex items-center gap-4 mt-2">
                <Badge className={getDifficultyColor(difficulty)}>
                  {difficulty}
                </Badge>
                <span className="text-sm text-muted-foreground">
                  Estimated time: {estimatedTime} minutes
                </span>
              </div>
            </div>
            <Button onClick={onLaunchLab} size="lg">
              <Play className="h-4 w-4 mr-2" />
              Start {capitalizeFirstLetter(labType.toLowerCase())}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Lab Content */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="instructions">Instructions</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="validation">Validation</TabsTrigger>
          <TabsTrigger value="submission">Submission</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="h-5 w-5" />
                Lab Objectives
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {objectives.map((objective, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm">{objective}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Prerequisites
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {prerequisites.map((prerequisite, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <div className="h-2 w-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                    <span className="text-sm">{prerequisite}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="instructions" className="space-y-4">
          <Alert>
            <Info className="h-4 w-4" />
            <AlertTitle>Before You Begin</AlertTitle>
            <AlertDescription>
              Make sure you have launched the lab environment before following
              these instructions.
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>Step-by-Step Instructions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    1
                  </div>
                  <h3 className="font-medium">Initial Setup</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Connect to your lab environment and verify all devices are
                  accessible.
                </p>
                <div className="ml-8 bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">
                      Terminal Command
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard("ping 192.168.1.1")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <code className="text-sm">ping 192.168.1.1</code>
                </div>
              </div>

              <Separator />

              {/* Step 2 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    2
                  </div>
                  <h3 className="font-medium">Configure Network Devices</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Apply the basic configuration to your router and switch
                  devices.
                </p>
                <div className="ml-8 bg-muted p-3 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium">
                      Router Configuration
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        copyToClipboard(`enable
configure terminal
hostname R1
interface gigabitethernet0/0
ip address 192.168.1.1 255.255.255.0
no shutdown`)
                      }
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <pre className="text-xs">
                    {`enable
configure terminal
hostname R1
interface gigabitethernet0/0
ip address 192.168.1.1 255.255.255.0
no shutdown`}
                  </pre>
                </div>
              </div>

              <Separator />

              {/* Step 3 */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    3
                  </div>
                  <h3 className="font-medium">Test Connectivity</h3>
                </div>
                <p className="text-sm text-muted-foreground ml-8">
                  Verify that all devices can communicate with each other.
                </p>
                <Alert className="left-8 w-[98%]">
                  <CheckCircle className="h-4 w-4" />
                  <AlertTitle>Success Criteria</AlertTitle>
                  <AlertDescription>
                    All ping tests should return successful responses with 0%
                    packet loss.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Additional Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <FileText className="h-5 w-5 text-blue-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">Network Configuration Guide</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete reference for device configuration
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Terminal className="h-5 w-5 text-green-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">Command Reference</h4>
                    <p className="text-sm text-muted-foreground">
                      Quick reference for common commands
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-3 p-3 border rounded-lg">
                  <Play className="h-5 w-5 text-purple-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">Video Tutorial</h4>
                    <p className="text-sm text-muted-foreground">
                      Step-by-step video walkthrough
                    </p>
                  </div>
                  <Button size="sm" variant="outline">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Validation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Validation Process</AlertTitle>
                <AlertDescription>
                  Complete these validation steps to ensure your lab is
                  configured correctly.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium">Network Connectivity</h4>
                    <p className="text-sm text-muted-foreground">
                      Verify all devices can ping each other
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium">Configuration Backup</h4>
                    <p className="text-sm text-muted-foreground">
                      Save running configuration to startup
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 border rounded-lg">
                  <div className="w-6 h-6 bg-blue-100 text-blue-800 rounded-full flex items-center justify-center text-sm font-medium">
                    ✓
                  </div>
                  <div>
                    <h4 className="font-medium">Documentation</h4>
                    <p className="text-sm text-muted-foreground">
                      Document your network topology and configurations
                    </p>
                  </div>
                </div>
              </div>

              <Button className="w-full">Submit Lab for Review</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="submission" className="space-y-4">
          {showSubmission ? (
            <LabSubmission
              projectId={projectId}
              userId={userId}
              existingSubmission={submission ?? null}
              onSubmissionUpdate={handleSubmissionUpdate}
              onClose={() => setShowSubmission(false)}
            />
          ) : (
            <SubmissionStatus
              submission={submission}
              onViewSubmission={() => setShowSubmission(true)}
              onEditSubmission={() => setShowSubmission(true)}
            />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
