"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Badge } from "@clnt/components/ui/badge";
import { Progress } from "@clnt/components/ui/progress";
import { Separator } from "@clnt/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import {
  BookOpen,
  Clock,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  Lightbulb,
  Info,
  Play,
  Code,
  ImageIcon,
} from "lucide-react";
import type { ReadingContent, ReadingSection } from "@clnt/types/project";

interface ReadingPageProps {
  content: ReadingContent;
  onComplete: () => void;
}

export function ReadingPage({ content, onComplete }: ReadingPageProps) {
  const [currentSection, setCurrentSection] = useState(0);
  const [readingSections, setReadingSections] = useState<boolean[]>(
    new Array(content.sections.length).fill(false),
  );
  const [startTime] = useState(Date.now());
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  const handleSectionComplete = (sectionIndex: number) => {
    const newReadingSections = [...readingSections];
    newReadingSections[sectionIndex] = true;
    setReadingSections(newReadingSections);
  };

  const handleNextSection = () => {
    handleSectionComplete(currentSection);
    if (currentSection < content.sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePreviousSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const completedSections = readingSections.filter(Boolean).length;
  const progressPercentage =
    (completedSections / content.sections.length) * 100;
  const isCompleted = completedSections === content.sections.length;

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors];
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const renderSectionContent = (section: ReadingSection) => {
    switch (section.type) {
      case "TEXT":
        return (
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: section.content }} />
          </div>
        );
      case "CODE":
        return (
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Code className="h-4 w-4" />
              <span className="text-sm font-medium">Code Example</span>
            </div>
            <pre className="text-sm overflow-x-auto">
              <code>{section.content}</code>
            </pre>
          </div>
        );
      case "CALLOUT":
        return (
          <Alert>
            <Lightbulb className="h-4 w-4" />
            <AlertTitle>Key Point</AlertTitle>
            <AlertDescription>{section.content}</AlertDescription>
          </Alert>
        );
      case "IMAGE":
        return (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <ImageIcon className="h-4 w-4" />
              <span className="text-sm font-medium">{section.title}</span>
            </div>
            <img
              src={section.content || "/placeholder.svg?height=300&width=500"}
              alt={section.title}
              className="max-w-full h-auto rounded-lg border"
            />
          </div>
        );
      case "VIDEO":
        return (
          <div className="text-center">
            <div className="inline-flex items-center gap-2 mb-2">
              <Play className="h-4 w-4" />
              <span className="text-sm font-medium">{section.title}</span>
            </div>
            <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
              <Button variant="outline">
                <Play className="h-4 w-4 mr-2" />
                Play Video
              </Button>
            </div>
          </div>
        );
      default:
        return <div>{section.content}</div>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">{content.title}</h1>
                <Badge className={getDifficultyColor(content.difficulty)}>
                  {content.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Est. {content.estimatedReadTime} min read
                </div>
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {content.sections.length} sections
                </div>
                <div>Reading time: {formatTime(readingTime)}</div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {completedSections}/{content.sections.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Sections completed
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress value={progressPercentage} className="w-full" />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                      {currentSection + 1}
                    </span>
                    {content.sections[currentSection]?.title}
                  </CardTitle>
                  <Badge
                    variant={
                      readingSections[currentSection] ? "default" : "secondary"
                    }
                  >
                    {readingSections[currentSection] ? "Completed" : "Reading"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {renderSectionContent(content.sections[currentSection])}

                <Separator />

                <div className="flex items-center justify-between">
                  <Button
                    variant="outline"
                    onClick={handlePreviousSection}
                    disabled={currentSection === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  <div className="flex gap-2">
                    {!readingSections[currentSection] && (
                      <Button
                        variant="outline"
                        onClick={() => handleSectionComplete(currentSection)}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Read
                      </Button>
                    )}

                    {currentSection < content.sections.length - 1 ? (
                      <Button onClick={handleNextSection}>
                        Next Section
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        onClick={onComplete}
                        disabled={!isCompleted}
                        className="bg-green-600 hover:bg-green-700 text-accent-foreground"
                      >
                        Complete Reading
                        <CheckCircle className="h-4 w-4 ml-2" />
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Learning Objectives */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Learning Objectives
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {content.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{objective}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Section Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {content.sections.map((section, index) => (
                    <div
                      key={section.id}
                      className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
                        index === currentSection
                          ? "bg-primary/10 border border-primary/20"
                          : "hover:bg-muted"
                      }`}
                      onClick={() => setCurrentSection(index)}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          readingSections[index]
                            ? "bg-green-500 text-white"
                            : index === currentSection
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {readingSections[index] ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          index + 1
                        )}
                      </div>
                      <span
                        className={`text-sm ${index === currentSection ? "font-medium" : ""}`}
                      >
                        {section.title}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Key Terms */}
            {content.keyTerms.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="h-5 w-5" />
                    Key Terms
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {content.keyTerms.map((term, index) => (
                      <div
                        key={index}
                        className="border-l-2 border-primary pl-3"
                      >
                        <div className="font-medium text-sm">{term.term}</div>
                        <div className="text-xs text-muted-foreground">
                          {term.definition}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Navigation */}
            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  onClick={onPrevious}
                  className="w-full bg-transparent"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Previous Lesson
                </Button>
                <Button
                  onClick={onNext}
                  className="w-full"
                  disabled={!isCompleted}
                >
                  Next Lesson
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card> */}
          </div>
        </div>
      </div>
    </div>
  );
}
