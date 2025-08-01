import { CopyButton } from "@clnt/components/ui/button";
import { Card, CardContent } from "@clnt/components/ui/card";
import { Checkbox } from "@clnt/components/ui/checkbox";
import { useDropzone } from "@clnt/components/ui/dropzone";
import { VerificationStep } from "@clnt/types/lab";
import { useEffect } from "react";
import { toast } from "sonner";

interface LabGuideVerificationProps {
  verification: VerificationStep;
  isCompleted: boolean;
  file: File | null;
  previewUrl: string | null;
  onVerificationComplete: (id: string) => void;
  onVerificationSubmitWithScreenshot?: (id: string, file: File) => void;
  setVerificationFiles: React.Dispatch<
    React.SetStateAction<Record<string, File>>
  >;
  setPreviewUrls: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  copyToClipboard: (text: string) => void;
}

const LabGuideVerification: React.FC<LabGuideVerificationProps> = ({
  verification,
  isCompleted,
  file,
  previewUrl,
  copyToClipboard,
  onVerificationComplete,
  setVerificationFiles,
  setPreviewUrls,
}) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const handleDrop = async (
    file: File,
  ): Promise<
    { status: "success"; result: File } | { status: "error"; error: string }
  > => {
    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image must be less than 5MB.");
      return {
        status: "error",
        error: "Image must be less than 5MB.",
      };
    }

    try {
      const renamedFile = new File(
        [file],
        `${verification.id}${file.name.slice(file.name.lastIndexOf("."))}`,
        {
          type: file.type,
        },
      );

      const previewUrl = URL.createObjectURL(renamedFile);

      setVerificationFiles((prev) => ({
        ...prev,
        [verification.id]: renamedFile,
      }));

      setPreviewUrls((prev) => ({
        ...prev,
        [verification.id]: previewUrl,
      }));

      return {
        status: "success",
        result: renamedFile,
      };
    } catch (err) {
      return {
        status: "error",
        error: err instanceof Error ? err.message : "Unknown error",
      };
    }
  };

  const dropzone = useDropzone({
    onDropFile: handleDrop,
    validation: {
      accept: {
        "image/*": [".png", ".jpg", ".jpeg"],
      },
      maxSize: 5 * 1024 * 1024, // 5MB
      maxFiles: 1,
    },
  });

  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <Card
      key={verification.id}
      className={`${isCompleted ? "bg-blue-100/20 border-blue-200/80" : ""}`}
    >
      <CardContent className="p-4 space-y-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={isCompleted}
            onCheckedChange={() => onVerificationComplete(verification.id)}
            className="mt-1"
            disabled={verification.requiresScreenshot && !file}
          />
          <div className="flex-1 space-y-3">
            <div className="font-medium">{verification.description}</div>
            <div className="space-y-2">
              <div className="text-sm font-medium">Verification Command:</div>
              <div className="flex items-center gap-2">
                <div className="bg-gray-900 text-gray-100 p-2 rounded font-mono text-sm whitespace-pre-wrap flex-1">
                  {verification.commands
                    .map((command) => `${verification.device}# ${command}`)
                    .join("\n")}
                </div>
                <CopyButton
                  text={verification.commands
                    .map((command) => `${verification.device}# ${command}`)
                    .join("\n")}
                  onCopy={copyToClipboard}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-sm font-medium">Expected Output:</div>
              <div className="p-2 rounded font-mono text-sm whitespace-pre-wrap border-2 w-[95%]">
                {verification.expectedOutput.join("\n")}
              </div>
            </div>

            {verification.requiresScreenshot && (
              <div className="space-y-2">
                <div className="text-sm font-medium">Upload Screenshot:</div>

                <div
                  {...dropzone.getRootProps()}
                  className="border-dashed border-2 rounded-lg p-4 cursor-pointer text-center w-[95%] "
                >
                  <input {...dropzone.getInputProps()} />
                  {file ? (
                    <img
                      src={previewUrl || ""}
                      alt="preview"
                      className="max-h-48 mx-auto rounded border"
                    />
                  ) : (
                    <p>Drag & drop or click to upload</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LabGuideVerification;
