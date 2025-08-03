import PageMeta from "@clnt/components/common/page-meta";
import StudentProgress from "../common/progress-viewer";

const CompletionsContent = () => {
  return (
    <div className="w-full h-full">
      <PageMeta
        title="Completions"
        description="Project completions overview"
      />
      <h1 className="text-xl font-semibold mb-4">Project Completions</h1>
      <StudentProgress />
    </div>
  );
};

export default CompletionsContent;
