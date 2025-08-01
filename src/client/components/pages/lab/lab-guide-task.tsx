import { Button, CopyButton } from "@clnt/components/ui/button";
import { Card, CardContent } from "@clnt/components/ui/card";
import { Checkbox } from "@clnt/components/ui/checkbox";
import { Badge } from "@clnt/components/ui/badge";
import { Lightbulb } from "lucide-react";
import { LabTask } from "@clnt/types/lab";

interface LabGuideTaskProps {
  task: LabTask;
  isCompleted: boolean;
  showHint: boolean;
  onTaskComplete: (id: string) => void;
  toggleHint: (id: string) => void;
  copyToClipboard: (text: string) => void;
}

const LabGuideTask: React.FC<LabGuideTaskProps> = ({
  task,
  isCompleted,
  showHint,
  onTaskComplete,
  toggleHint,
  copyToClipboard,
}) => {
  return (
    <Card
      key={task.id}
      className={`${isCompleted ? "bg-blue-100/20 border-blue-200/80" : ""}`}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onTaskComplete(task.id)}
            className="mt-1"
          />
          <div className="flex-1 space-y-3">
            <div className="font-medium">{task.description}</div>

            {task.device && (
              <Badge variant="outline" className="text-xs">
                Device: {task.device}
              </Badge>
            )}

            {task.commands && task.commands.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-muted-foreground">
                    <strong>Commands to execute:</strong>
                  </div>
                  <CopyButton
                    text={(task?.commands ?? [""]).join("\n")}
                    onCopy={() =>
                      copyToClipboard((task?.commands ?? [""]).join("\n"))
                    }
                  />
                </div>
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
                  <pre>{task.commands.join("\n")}</pre>
                </div>
              </div>
            )}

            {task.expectedResult && (
              <div className="text-sm text-muted-foreground">
                <strong>Expected Result:</strong> {task.expectedResult}
              </div>
            )}

            {task.hints.length > 0 && (
              <div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => toggleHint(task.id)}
                  className="text-blue-600"
                >
                  <Lightbulb className="h-4 w-4 mr-1" />
                  {showHint ? "Hide Hints" : "Show Hints"}
                </Button>
                {showHint && (
                  <div className="mt-2 space-y-1">
                    {task.hints.map((hint, index) => (
                      <div
                        key={index}
                        className="text-sm text-blue-600 bg-blue-50 p-2 rounded"
                      >
                        💡 {hint}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabGuideTask;
