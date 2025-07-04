import { SectionCards } from "@clnt/components/common/section-cards";
import { ChartAreaInteractive } from "@clnt/components/common/chart-area-interactive";
import { data } from "@clnt/constants/data";
import { DataTable } from "@clnt/components/common/data-table";

export default function DashboardContent() {
  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 md:gap-6">
          <SectionCards />
          <ChartAreaInteractive />
          <DataTable data={data.table} />
        </div>
      </div>
    </div>
  );
}
