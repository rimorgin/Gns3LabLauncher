"use client";

import { useState } from "react";
import { QuizPage } from "@clnt/components/pages/labs/quiz";
import type { Quiz, QuizAttempt } from "@clnt/types/project";
import { useParams } from "react-router";

// Mock quiz data
const mockQuiz: Quiz = {
  id: "quiz_1",
  title: "Network Fundamentals Quiz",
  description: "Test your understanding of basic networking concepts",
  timeLimit: 10, // 10 minutes
  passingScore: 70,
  attempts: 3,
  difficulty: "BEGINNER",
  questions: [
    {
      id: "q1",
      type: "MULTIPLE_CHOICE",
      question: "What is the primary function of a router in a network?",
      options: [
        "To connect devices within the same network",
        "To forward data packets between different networks",
        "To provide wireless connectivity",
        "To store network data",
      ],
      correctAnswer: "To forward data packets between different networks",
      explanation:
        "Routers are responsible for forwarding data packets between different networks, making routing decisions based on network addresses.",
      points: 10,
    },
    {
      id: "q2",
      type: "TRUE_FALSE",
      question: "A switch operates at the Physical layer of the OSI model.",
      correctAnswer: "false",
      explanation:
        "Switches operate at the Data Link layer (Layer 2) of the OSI model, not the Physical layer (Layer 1).",
      points: 10,
    },
    {
      id: "q3",
      type: "MULTIPLE_CHOICE",
      question: "Which of the following is NOT a network topology?",
      options: ["Star", "Ring", "Mesh", "Protocol"],
      correctAnswer: "Protocol",
      explanation:
        "Protocol is not a network topology. Star, Ring, and Mesh are all common network topologies.",
      points: 10,
    },
    {
      id: "q4",
      type: "FILL_BLANK",
      question:
        "The _____ model has 7 layers and is used as a reference for network communication.",
      correctAnswer: "OSI",
      explanation:
        "The OSI (Open Systems Interconnection) model is a 7-layer reference model for network communication.",
      points: 15,
    },
    {
      id: "q5",
      type: "MULTIPLE_CHOICE",
      question: "What does IP stand for in networking?",
      options: [
        "Internet Provider",
        "Internet Protocol",
        "Internal Process",
        "Information Packet",
      ],
      correctAnswer: "Internet Protocol",
      explanation:
        "IP stands for Internet Protocol, which is responsible for addressing and routing packets across networks.",
      points: 10,
    },
    {
      id: "q6",
      type: "TRUE_FALSE",
      question: "Ethernet is a wireless networking technology.",
      correctAnswer: "false",
      explanation:
        "Ethernet is a wired networking technology that uses cables to connect devices. Wi-Fi is the wireless equivalent.",
      points: 10,
    },
    {
      id: "q7",
      type: "MULTIPLE_CHOICE",
      question:
        "Which device is used to connect multiple devices within the same network segment?",
      options: ["Router", "Switch", "Modem", "Gateway"],
      correctAnswer: "Switch",
      explanation:
        "A switch is used to connect multiple devices within the same network segment, creating a local area network (LAN).",
      points: 10,
    },
    {
      id: "q8",
      type: "FILL_BLANK",
      question:
        "The process of finding the best path for data to travel from source to destination is called _____.",
      correctAnswer: "routing",
      explanation:
        "Routing is the process of selecting the best path for data to travel from source to destination across networks.",
      points: 15,
    },
  ],
};

export default function QuizPageRoute() {
  const params = useParams();
  console.log("🚀 ~ QuizPageRoute ~ params:", params);
  const [quiz] = useState<Quiz>(mockQuiz);

  const handleComplete = (attempt: QuizAttempt) => {
    console.log("Quiz completed!", attempt);
    // Save attempt to database
    // Update progress
  };

  const handleNext = () => {
    console.log("Navigate to next lesson");
    // Navigate to next lesson
  };

  const handlePrevious = () => {
    console.log("Navigate to previous lesson");
    // Navigate to previous lesson
  };

  return (
    <QuizPage
      quiz={quiz}
      onComplete={handleComplete}
      onNext={handleNext}
      onPrevious={handlePrevious}
    />
  );
}
