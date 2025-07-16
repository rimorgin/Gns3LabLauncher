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
import { RadioGroup, RadioGroupItem } from "@clnt/components/ui/radio-group";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import {
  HelpCircle,
  Clock,
  CheckCircle,
  XCircle,
  ArrowRight,
  ArrowLeft,
  Target,
  AlertCircle,
  Trophy,
  RotateCcw,
} from "lucide-react";
import type {
  Quiz,
  QuizQuestion,
  QuizAttempt,
  QuizAnswer,
} from "@clnt/types/project";

interface QuizPageProps {
  quiz: Quiz;
  onComplete: (attempt: QuizAttempt) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export function QuizPage({
  quiz,
  onComplete,
  onNext,
  onPrevious,
}: QuizPageProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: string | string[] }>(
    {},
  );
  const [timeLeft, setTimeLeft] = useState(
    quiz.timeLimit ? quiz.timeLimit * 60 : null,
  );
  const [startTime] = useState(Date.now());
  const [showResults, setShowResults] = useState(false);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerChange = (
    questionId: string,
    answer: string | string[],
  ) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestion < quiz.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const quizAnswers: QuizAnswer[] = quiz.questions.map((question) => {
      const userAnswer = answers[question.id] || "";
      const isCorrect = Array.isArray(question.correctAnswer)
        ? Array.isArray(userAnswer) &&
          question.correctAnswer.every((ans) => userAnswer.includes(ans)) &&
          userAnswer.every((ans) => question.correctAnswer.includes(ans))
        : userAnswer === question.correctAnswer;

      return {
        questionId: question.id,
        answer: userAnswer,
        isCorrect,
        pointsEarned: isCorrect ? question.points : 0,
      };
    });

    const totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const score = quizAnswers.reduce((sum, a) => sum + a.pointsEarned, 0);
    const percentage = Math.round((score / totalPoints) * 100);

    const attempt: QuizAttempt = {
      id: `attempt_${Date.now()}`,
      userId: "current_user", // Replace with actual user ID
      quizId: quiz.id,
      answers: quizAnswers,
      score: percentage,
      totalPoints,
      startedAt: new Date(startTime),
      completedAt: new Date(),
      timeSpent: Math.floor((Date.now() - startTime) / 1000),
    };

    setQuizAttempt(attempt);
    setShowResults(true);
    onComplete(attempt);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      BEGINNER: "bg-green-100 text-green-800",
      INTERMEDIATE: "bg-yellow-100 text-yellow-800",
      ADVANCED: "bg-red-100 text-red-800",
    };
    return colors[difficulty as keyof typeof colors];
  };

  const getScoreColor = (score: number) => {
    if (score >= quiz.passingScore) return "text-green-600";
    if (score >= quiz.passingScore * 0.7) return "text-yellow-600";
    return "text-red-600";
  };

  const renderQuestion = (question: QuizQuestion) => {
    const userAnswer = answers[question.id];

    switch (question.type) {
      case "MULTIPLE_CHOICE":
        return (
          <RadioGroup
            value={(userAnswer as string) || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            {question.options?.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`${question.id}-${index}`} />
                <Label
                  htmlFor={`${question.id}-${index}`}
                  className="cursor-pointer"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );

      case "TRUE_FALSE":
        return (
          <RadioGroup
            value={(userAnswer as string) || ""}
            onValueChange={(value) => handleAnswerChange(question.id, value)}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="true" id={`${question.id}-true`} />
              <Label htmlFor={`${question.id}-true`} className="cursor-pointer">
                True
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="false" id={`${question.id}-false`} />
              <Label
                htmlFor={`${question.id}-false`}
                className="cursor-pointer"
              >
                False
              </Label>
            </div>
          </RadioGroup>
        );

      case "FILL_BLANK":
        return (
          <Input
            value={(userAnswer as string) || ""}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            placeholder="Enter your answer..."
            className="max-w-md"
          />
        );

      default:
        return <div>Question type not supported</div>;
    }
  };

  const renderResults = () => {
    if (!quizAttempt) return null;

    const passed = quizAttempt.score >= quiz.passingScore;

    return (
      <div className="space-y-6">
        {/* Results Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                {passed ? (
                  <Trophy className="h-6 w-6 text-yellow-500" />
                ) : (
                  <XCircle className="h-6 w-6 text-red-500" />
                )}
                Quiz Results
              </CardTitle>
              <Badge variant={passed ? "default" : "destructive"}>
                {passed ? "PASSED" : "FAILED"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div>
                <div
                  className={`text-3xl font-bold ${getScoreColor(quizAttempt.score)}`}
                >
                  {quizAttempt.score}%
                </div>
                <div className="text-sm text-muted-foreground">Score</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-primary">
                  {quizAttempt.answers.filter((a) => a.isCorrect).length}
                </div>
                <div className="text-sm text-muted-foreground">Correct</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground">
                  {quiz.questions.length}
                </div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-muted-foreground">
                  {formatTime(quizAttempt.timeSpent)}
                </div>
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
            </div>

            <div className="mt-4">
              <Progress value={quizAttempt.score} className="w-full" />
            </div>

            {!passed && (
              <Alert className="mt-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Passing Score Required</AlertTitle>
                <AlertDescription>
                  You need {quiz.passingScore}% to pass this quiz. Review the
                  material and try again.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Question Review */}
        <Card>
          <CardHeader>
            <CardTitle>Question Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {quiz.questions.map((question, index) => {
                const answer = quizAttempt.answers.find(
                  (a) => a.questionId === question.id,
                );
                const isCorrect = answer?.isCorrect || false;

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                          isCorrect
                            ? "bg-green-500 text-white"
                            : "bg-red-500 text-white"
                        }`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="h-3 w-3" />
                        ) : (
                          <XCircle className="h-3 w-3" />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-2">
                          Question {index + 1}
                        </h4>
                        <p className="text-sm mb-3">{question.question}</p>

                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Your answer: </span>
                            <span
                              className={
                                isCorrect ? "text-green-600" : "text-red-600"
                              }
                            >
                              {Array.isArray(answer?.answer)
                                ? answer.answer.join(", ")
                                : answer?.answer || "No answer"}
                            </span>
                          </div>
                          <div>
                            <span className="font-medium">
                              Correct answer:{" "}
                            </span>
                            <span className="text-green-600">
                              {Array.isArray(question.correctAnswer)
                                ? question.correctAnswer.join(", ")
                                : question.correctAnswer}
                            </span>
                          </div>
                          {question.explanation && (
                            <div className="mt-2 p-2 bg-blue-50 rounded text-xs">
                              <strong>Explanation:</strong>{" "}
                              {question.explanation}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={onPrevious}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Previous Lesson
          </Button>
          <div className="flex gap-2">
            {!passed && (
              <Button
                variant="outline"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="h-4 w-4 mr-2" />
                Retake Quiz
              </Button>
            )}
            <Button onClick={onNext} disabled={!passed}>
              Next Lesson
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  };

  if (showResults) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">{renderResults()}</div>
      </div>
    );
  }

  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = (answeredQuestions / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <HelpCircle className="h-6 w-6 text-primary" />
                <h1 className="text-2xl font-bold">{quiz.title}</h1>
                <Badge className={getDifficultyColor(quiz.difficulty)}>
                  {quiz.difficulty}
                </Badge>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Target className="h-4 w-4" />
                  {quiz.questions.length} questions
                </div>
                <div>Passing score: {quiz.passingScore}%</div>
                {timeLeft !== null && (
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time left: {formatTime(timeLeft)}
                  </div>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-primary">
                {currentQuestion + 1}/{quiz.questions.length}
              </div>
              <div className="text-sm text-muted-foreground">
                Current question
              </div>
            </div>
          </div>

          <div className="mt-4">
            <Progress
              value={((currentQuestion + 1) / quiz.questions.length) * 100}
              className="w-full"
            />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-medium">
                    {currentQuestion + 1}
                  </span>
                  Question {currentQuestion + 1}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-lg">
                  {quiz.questions[currentQuestion].question}
                </div>

                {quiz.questions[currentQuestion].image && (
                  <img
                    src={
                      quiz.questions[currentQuestion].image ||
                      "/placeholder.svg"
                    }
                    alt="Question illustration"
                    className="max-w-full h-auto rounded-lg border"
                  />
                )}

                <div className="space-y-4">
                  {renderQuestion(quiz.questions[currentQuestion])}
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestion === 0}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Previous
                  </Button>

                  {currentQuestion < quiz.questions.length - 1 ? (
                    <Button onClick={handleNextQuestion}>
                      Next Question
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  ) : (
                    <Button
                      onClick={handleSubmitQuiz}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Submit Quiz
                      <CheckCircle className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quiz Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Questions</span>
                  <span className="font-medium">{quiz.questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Passing Score</span>
                  <span className="font-medium">{quiz.passingScore}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Attempts Allowed</span>
                  <span className="font-medium">{quiz.attempts}</span>
                </div>
                {quiz.timeLimit && (
                  <div className="flex justify-between">
                    <span className="text-sm">Time Limit</span>
                    <span className="font-medium">{quiz.timeLimit} min</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Answered</span>
                    <span>
                      {answeredQuestions}/{quiz.questions.length}
                    </span>
                  </div>
                  <Progress value={progressPercentage} />
                </div>
              </CardContent>
            </Card>

            {/* Question Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Questions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {quiz.questions.map((_, index) => (
                    <Button
                      key={index}
                      variant={
                        index === currentQuestion ? "default" : "outline"
                      }
                      size="sm"
                      className={`w-8 h-8 p-0 ${
                        answers[quiz.questions[index].id]
                          ? "bg-green-100 border-green-300"
                          : ""
                      }`}
                      onClick={() => setCurrentQuestion(index)}
                    >
                      {index + 1}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
