import { LogsViewer } from "../common/log-viewer";
import { useLogsQuery } from "@clnt/lib/queries/system-logs-query";
import Loader from "../common/loader";
import { Navigate } from "react-router";

export default function SystemLogsContent() {
  const { data: logs, isLoading, isError } = useLogsQuery();

  const handleRefresh = () => {
    console.log("Refreshing logs...");
    // In a real app, you would fetch fresh logs from your API
    alert("Logs refreshed!");
  };

  const handleExport = () => {
    console.log("Exporting logs...");
    // In a real app, you would export logs to CSV/JSON
    const dataStr = JSON.stringify(logs, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `logs-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
  };

  if (isLoading) return <Loader />;
  if (isError || !logs) return <Navigate to={"/errorPage"} />;

  return (
    <LogsViewer logs={logs} onRefresh={handleRefresh} onExport={handleExport} />
  );
}
