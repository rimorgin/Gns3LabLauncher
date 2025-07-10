import { SectionCards } from "@clnt/components/common/section-cards";
import { useDashboardQuery } from "@clnt/lib/queries/dashboard-query";
import { ChartAreaInteractive } from "../common/chart-area-interactive";

export default function DashboardContent() {
  const { data, isLoading, error } = useDashboardQuery();

  if (isLoading) return <p>Loading…</p>;
  if (error) return <p>Error loading dashboard</p>;
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards data={data?.summary} />
          <ChartAreaInteractive data={data?.series} />
        </div>
      </div>
    </div>
  );
}
