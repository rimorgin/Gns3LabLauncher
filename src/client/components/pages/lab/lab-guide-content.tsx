import { Alert, AlertDescription } from "@clnt/components/ui/alert";
import { Badge } from "@clnt/components/ui/badge";
import { Button, CopyButton } from "@clnt/components/ui/button";
import { LabContent } from "@clnt/types/lab";
import {
  Code,
  Terminal,
  EyeOff,
  Eye,
  Info,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  Monitor,
} from "lucide-react";

interface LabGuideContentProps {
  content: LabContent;
  expandedOutputs: Record<string, boolean>;
  toggleOutput: (id: string) => void;
  copyToClipboard: (text: string) => void;
}

const LabGuideContent: React.FC<LabGuideContentProps> = ({
  content,
  expandedOutputs,
  toggleOutput,
  copyToClipboard,
}) => {
  switch (content.type) {
    case "text":
      return (
        <div className="prose dark:prose-invert max-w-none">
          <div dangerouslySetInnerHTML={{ __html: content.content }} />
        </div>
      );

    case "code":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code className="h-4 w-4" />
              <span className="text-sm font-medium">
                {content.metadata?.device
                  ? `${content.metadata.device} Configuration`
                  : "Code"}
              </span>
              {content.metadata?.language && (
                <Badge variant="outline" className="text-xs">
                  {content.metadata.language}
                </Badge>
              )}
            </div>
            <CopyButton text={content.content} onCopy={copyToClipboard} />
          </div>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{content.content}</pre>
          </div>
        </div>
      );

    case "terminal":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4" />
              <span className="text-sm font-medium">
                {content.metadata?.device
                  ? `${content.metadata.device} Terminal`
                  : "Terminal Command"}
              </span>
            </div>
            <div className="flex gap-2">
              <CopyButton
                text={content.metadata?.command || ""}
                onCopy={copyToClipboard}
              />
              {content.metadata?.expected_output && (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleOutput(content.id)}
                >
                  {expandedOutputs[content.id] ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm">
            <div className="mb-2">
              <span className="text-blue-400">
                {content.metadata?.device || "device"}@lab:~$
              </span>{" "}
              {content.metadata?.command || content.content}
            </div>
            {expandedOutputs[content.id] &&
              content.metadata?.expected_output && (
                <div className="text-gray-300 whitespace-pre-wrap">
                  {content.metadata.expected_output}
                </div>
              )}
          </div>
        </div>
      );

    case "callout": {
      const calloutType = content.metadata?.callout_type || "info";
      const calloutIcons = {
        info: Info,
        warning: AlertTriangle,
        success: CheckCircle,
        error: AlertTriangle,
        tip: Lightbulb,
      };
      const CalloutIcon =
        calloutIcons[calloutType as keyof typeof calloutIcons];

      return (
        <Alert
          className={`border-l-4 ${
            calloutType === "warning" || calloutType === "error"
              ? "border-l-yellow-500"
              : calloutType === "success"
                ? "border-l-green-500"
                : calloutType === "tip"
                  ? "border-l-blue-500"
                  : "border-l-gray-500"
          }`}
        >
          <CalloutIcon className="h-4 w-4" />
          <AlertDescription>{content.content}</AlertDescription>
        </Alert>
      );
    }
    case "image":
      return (
        <div className="text-center">
          <img
            src={content.content || "/placeholder.svg"}
            alt="Lab illustration"
            className="max-w-full h-auto rounded-lg border mx-auto"
          />
        </div>
      );

    case "topology":
      return (
        <div className="border rounded-lg p-4 bg-gray-50">
          <div className="flex items-center gap-2 mb-3">
            <Monitor className="h-4 w-4" />
            <span className="font-medium">Network Topology</span>
          </div>
          <div className="text-center text-muted-foreground">
            Interactive topology view would be rendered here
          </div>
        </div>
      );

    default:
      return <div>{content.content}</div>;
  }
};

export default LabGuideContent;
