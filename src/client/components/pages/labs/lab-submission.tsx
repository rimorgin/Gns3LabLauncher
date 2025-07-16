import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@clnt/components/ui/card";
import { Button } from "@clnt/components/ui/button";
import { Textarea } from "@clnt/components/ui/textarea";
import { Input } from "@clnt/components/ui/input";
import { Label } from "@clnt/components/ui/label";
import { Badge } from "@clnt/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@clnt/components/ui/alert";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@clnt/components/ui/tabs";
import { Progress } from "@clnt/components/ui/progress";
import {
  Upload,
  FileText,
  ImageIcon,
  Code,
  Save,
  Send,
  CheckCircle,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import type { Submission } from "@clnt/types/project";

interface LabSubmissionProps {
  projectId: string;
  userId: string;
  existingSubmission?: Submission | null;
  onSubmissionUpdate: (submission: Submission) => void;
  onClose: () => void;
}

export function LabSubmission({
  projectId,
  userId,
  existingSubmission,
  onSubmissionUpdate,
  onClose,
}: LabSubmissionProps) {
  const [submission, setSubmission] = useState({
    content: existingSubmission?.content || "",
    status: existingSubmission?.status || ("DRAFT" as const),
    attachments: [] as File[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleContentChange = (content: string) => {
    setSubmission((prev) => ({ ...prev, content }));
  };

  const handleFileUpload = (files: FileList | null) => {
    if (files) {
      const newFiles = Array.from(files);
      setSubmission((prev) => ({
        ...prev,
        attachments: [...prev.attachments, ...newFiles],
      }));
    }
  };

  const removeAttachment = (index: number) => {
    setSubmission((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
  };

  const saveDraft = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const updatedSubmission: Submission = {
        id: existingSubmission?.id || `sub_${Date.now()}`,
        userId,
        projectId,
        content: submission.content,
        status: "DRAFT",
        score: null,
        feedback: null,
        submittedAt: new Date(),
      };

      onSubmissionUpdate(updatedSubmission);
      setSubmission((prev) => ({ ...prev, status: "DRAFT" }));
    } catch (error) {
      console.error("Failed to save draft:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitForReview = async () => {
    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      // Simulate file upload progress
      for (let i = 0; i <= 100; i += 10) {
        setUploadProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      const updatedSubmission: Submission = {
        id: existingSubmission?.id || `sub_${Date.now()}`,
        userId,
        projectId,
        content: submission.content,
        status: "SUBMITTED",
        score: null,
        feedback: null,
        submittedAt: new Date(),
      };

      onSubmissionUpdate(updatedSubmission);
      setSubmission((prev) => ({ ...prev, status: "SUBMITTED" }));
    } catch (error) {
      console.error("Failed to submit:", error);
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      DRAFT: "bg-gray-100 text-gray-800",
      SUBMITTED: "bg-blue-100 text-blue-800",
      REVIEWED: "bg-green-100 text-green-800",
    };
    return colors[status as keyof typeof colors];
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      DRAFT: Save,
      SUBMITTED: Clock,
      REVIEWED: CheckCircle,
    };
    const Icon = icons[status as keyof typeof icons];
    return <Icon className="h-4 w-4" />;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Lab Submission</h2>
          <p className="text-muted-foreground">
            Submit your lab work for review and grading
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={getStatusColor(submission.status)}>
            {getStatusIcon(submission.status)}
            <span className="ml-1">{submission.status}</span>
          </Badge>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>

      {/* Existing Submission Alert */}
      {existingSubmission && (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Previous Submission Found</AlertTitle>
          <AlertDescription>
            You have a previous submission for this lab. You can continue
            editing or view your feedback below.
          </AlertDescription>
        </Alert>
      )}

      {/* Submission Form */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="attachments">Attachments</TabsTrigger>
          <TabsTrigger value="review">Review</TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lab Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="content">
                  Describe your lab implementation and findings
                </Label>
                <Textarea
                  id="content"
                  placeholder="Provide a detailed description of your lab work, including:
- Network topology implemented
- Configuration commands used
- Testing results and validation
- Challenges encountered and solutions
- Screenshots or diagrams (attach separately)"
                  value={submission.content}
                  onChange={(e) => handleContentChange(e.target.value)}
                  className="min-h-[300px]"
                />
              </div>

              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{submission.content.length} characters</span>
                <span>Minimum 500 characters recommended</span>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attachments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>File Attachments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Area */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <Input
                  type="file"
                  multiple
                  accept=".png,.jpg,.jpeg,.pdf,.txt,.cfg,.json"
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <Label htmlFor="file-upload" className="cursor-pointer">
                  <Button variant="outline" asChild>
                    <span>Choose Files</span>
                  </Button>
                </Label>
                <p className="text-xs text-gray-500 mt-2">
                  Supported: PNG, JPG, PDF, TXT, CFG, JSON (Max 10MB each)
                </p>
              </div>

              {/* Uploaded Files */}
              {submission.attachments.length > 0 && (
                <div className="space-y-2">
                  <Label>
                    Uploaded Files ({submission.attachments.length})
                  </Label>
                  {submission.attachments.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-3 border rounded-lg"
                    >
                      <div className="flex-shrink-0">
                        {file.type.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5 text-blue-500" />
                        ) : file.name.endsWith(".cfg") ? (
                          <Code className="h-5 w-5 text-green-500" />
                        ) : (
                          <FileText className="h-5 w-5 text-gray-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {file.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeAttachment(index)}
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Submission Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Content Preview */}
              <div>
                <Label className="text-sm font-medium">
                  Lab Report Preview
                </Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg max-h-40 overflow-y-auto">
                  <p className="text-sm whitespace-pre-wrap">
                    {submission.content || "No content provided"}
                  </p>
                </div>
              </div>

              {/* Attachments Summary */}
              <div>
                <Label className="text-sm font-medium">
                  Attachments ({submission.attachments.length})
                </Label>
                {submission.attachments.length > 0 ? (
                  <div className="mt-2 space-y-1">
                    {submission.attachments.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600">
                        • {file.name}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 mt-2">No attachments</p>
                )}
              </div>

              {/* Submission Checklist */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Submission Checklist
                </Label>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    {submission.content.length >= 500 ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      Detailed lab report (minimum 500 characters)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.attachments.some((f) =>
                      f.name.endsWith(".cfg"),
                    ) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      Configuration files included
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    {submission.attachments.some((f) =>
                      f.type.startsWith("image/"),
                    ) ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-yellow-500" />
                    )}
                    <span className="text-sm">
                      Screenshots or diagrams attached
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Upload Progress */}
      {isSubmitting && uploadProgress > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Uploading files...</span>
                <span>{uploadProgress}%</span>
              </div>
              <Progress value={uploadProgress} />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" onClick={saveDraft} disabled={isSubmitting}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
        </div>

        <Button
          onClick={submitForReview}
          disabled={isSubmitting || submission.content.length < 100}
        >
          <Send className="h-4 w-4 mr-2" />
          {isSubmitting ? "Submitting..." : "Submit for Review"}
        </Button>
      </div>

      {/* Previous Feedback */}
      {existingSubmission?.feedback && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Instructor Feedback
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {existingSubmission.score !== null && (
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold text-primary">
                  {existingSubmission.score}/100
                </div>
                <Badge
                  variant={
                    existingSubmission.score >= 70 ? "default" : "destructive"
                  }
                >
                  {existingSubmission.score >= 70
                    ? "Pass"
                    : "Needs Improvement"}
                </Badge>
              </div>
            )}
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm whitespace-pre-wrap">
                {existingSubmission.feedback}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
