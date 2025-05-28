import { AppSidebar } from "@clnt/components/app-sidebar";
import PageMeta from "@clnt/components/page-meta";
import { SiteHeader } from "@clnt/components/site-header";
import { SidebarInset, SidebarProvider } from "@clnt/components/ui/sidebar";
import { useAppStateStore } from "@clnt/lib/store/app-state-store";
import { DynamicContent } from "@clnt/components/dynamic-content";

export default function HomePage() {
  const { activeNavName } = useAppStateStore();
  return (
    <>
      <PageMeta
        title={activeNavName}
        description={`gns3 lab launcher ${activeNavName}`}
      />
      <SidebarProvider>
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <DynamicContent/>
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}
