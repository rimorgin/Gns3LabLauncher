"use client";

import { useState } from "react";
import { ReadingPage } from "@clnt/components/pages/labs/reading";
import type { ReadingContent } from "@clnt/types/project";
import { useParams, useSearchParams } from "react-router";
import { useProgress } from "@clnt/lib/queries/progress-query";
import { useProjectsQuery } from "@clnt/lib/queries/projects-query";
import { useProgressPatch } from "@clnt/lib/mutations/progress/progress-mutation";
import { useUser } from "@clnt/lib/auth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@clnt/components/ui/card";
import { Loader } from "lucide-react";
import { Button } from "@clnt/components/ui/button";
import router from "../route-layout";

// Mock reading content
const mockReadingContent: ReadingContent = {
  id: "reading_1",
  title: "Introduction to Network Fundamentals",
  content: "Comprehensive introduction to networking concepts",
  estimatedReadTime: 15,
  difficulty: "BEGINNER",
  objectives: [
    "Understand basic networking concepts",
    "Learn about network topologies",
    "Identify network components",
    "Understand the OSI model basics",
  ],
  keyTerms: [
    {
      term: "Network",
      definition:
        "A collection of interconnected devices that can communicate with each other",
    },
    {
      term: "Protocol",
      definition:
        "A set of rules that govern how data is transmitted over a network",
    },
    {
      term: "Router",
      definition:
        "A device that forwards data packets between computer networks",
    },
    {
      term: "Switch",
      definition:
        "A device that connects devices on a computer network by using packet switching",
    },
  ],
  sections: [
    {
      id: "section_1",
      title: "What is a Network?",
      content: `<p>A computer network is a collection of interconnected devices that can communicate and share resources with each other. Networks enable us to share files, printers, internet connections, and other resources efficiently.</p>
      
      <p>Networks can range from simple home setups connecting a few devices to complex enterprise networks spanning multiple locations worldwide.</p>
      
      <h3>Key Benefits of Networks:</h3>
      <ul>
        <li><strong>Resource Sharing:</strong> Share printers, files, and internet connections</li>
        <li><strong>Communication:</strong> Email, messaging, and video conferencing</li>
        <li><strong>Centralized Data:</strong> Store data in central locations for easy access</li>
        <li><strong>Cost Efficiency:</strong> Share expensive resources among multiple users</li>
      </ul>`,
      type: "TEXT",
      order: 1,
    },
    {
      id: "section_2",
      title: "Network Components",
      content: `Networks consist of several key components that work together to enable communication:

**End Devices (Hosts):**
- Computers, laptops, smartphones, tablets
- Servers, printers, IP cameras
- IoT devices

**Network Devices:**
- Routers: Connect different networks
- Switches: Connect devices within a network
- Access Points: Provide wireless connectivity
- Firewalls: Provide network security

**Network Media:**
- Ethernet cables (copper)
- Fiber optic cables
- Wireless (Wi-Fi, Bluetooth)`,
      type: "TEXT",
      order: 2,
    },
    {
      id: "section_3",
      title: "Network Topologies",
      content: "/placeholder.svg?height=300&width=500",
      type: "IMAGE",
      order: 3,
    },
    {
      id: "section_4",
      title: "Important Concept",
      content:
        "Understanding network fundamentals is crucial for anyone working with modern technology. Every device you use likely connects to a network in some way.",
      type: "CALLOUT",
      order: 4,
    },
    {
      id: "section_5",
      title: "Basic Network Commands",
      content: `# Check network connectivity
ping google.com

# Display network configuration
ipconfig /all    # Windows
ifconfig         # Linux/Mac

# Show routing table
route print      # Windows
route -n         # Linux/Mac

# Test DNS resolution
nslookup google.com`,
      type: "CODE",
      order: 5,
    },
  ],
};

export default function ReadingPageRoute() {
  const params = useParams();
  const [search] = useSearchParams();
  const user = useUser();
  const studentId = user.data?.id;
  const projectId = params.projectId;
  const {
    data: progress,
    isLoading: isProgressLoading,
    isError: isProgressError,
  } = useProgress({ projectId, studentId });
  const {
    data: project,
    isLoading: isProjectLoading,
    isError: isProjectError,
  } = useProjectsQuery({ by_id: projectId, includes: ["projectContent"] });

  const currentStepIndex = parseInt(search.get("step") ?? "0", 10);
  const totalSteps = project.steps.length;

  const { mutateAsync, status } = useProgressPatch();
  const [content] = useState<ReadingContent>(mockReadingContent);

  if (isProgressLoading || isProjectLoading || status === "pending") {
    return <Loader />;
  }
  if (isProgressError && isProjectError) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Error Loading Project</CardTitle>
          </CardHeader>
          <CardContent className="gap-5 flex flex-col">
            <p className="text-red-500">
              Unable to load project details. Please try again later.
            </p>
            <Button
              variant={"destructive"}
              onClick={() => router.navigate("/")}
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleComplete = async () => {
    if (!progress?.id) return;

    const completedSteps = currentStepIndex + 1; // because 0-based
    const percentComplete = Math.round((completedSteps / totalSteps) * 100);

    const status = percentComplete === 100 ? "COMPLETED" : "IN_PROGRESS";

    try {
      await mutateAsync({
        id: progress.id,
        data: {
          status: status,
          percentComplete: percentComplete,
        },
      });

      console.log("✅ Reading marked complete!");
      // optionally:
      router.navigate(`/labs/${projectId}?step=${currentStepIndex ?? 0 + 1}`);
    } catch (err) {
      console.error("Failed to update progress", err);
    }
  };

  return <ReadingPage content={content} onComplete={handleComplete} />;
}
