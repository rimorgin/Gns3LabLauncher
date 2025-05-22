import { AppSidebar } from "@clnt/components/app-sidebar";
import { ChartAreaInteractive } from "@clnt/components/chart-area-interactive";
import PageMeta from "@clnt/components/page-meta";
import { DataTable } from "@clnt/components/data-table";
import { SectionCards } from "@clnt/components/section-cards";
import { SiteHeader } from "@clnt/components/site-header";
import { SidebarInset, SidebarProvider } from "@clnt/components/ui/sidebar";
import { data } from "@clnt/constants/data";

export default function HomePage() {
  return (
    <>
      <PageMeta
        title="Home"
        description="session manager home"
      />
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
                <SectionCards />
                <div className="px-4 lg:px-6">
                  <ChartAreaInteractive />
                </div>
                <DataTable data={data.table} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
