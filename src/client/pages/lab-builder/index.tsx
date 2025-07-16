import { TemplateEditor } from "@clnt/components/pages/lab/lab-template-editor/template-editor";

export default function TemplateEditOrCreatePageRoute() {
  // In a real application, you would fetch an existing template here
  // based on a query parameter (e.g., /templates/editor?id=some-template-id)
  // For now, we'll assume we're creating a new template.
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Create/Edit Lab Template</h1>
      <TemplateEditor />
    </div>
  );
}
