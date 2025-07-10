import React, { Suspense } from "react";
import { AppSidebar } from "@clnt/components/common/app-sidebar";
import PageMeta from "@clnt/components/common/page-meta";
import { SiteHeader } from "@clnt/components/common/site-header";
import { SidebarInset, SidebarProvider } from "@clnt/components/ui/sidebar";
import DynamicContent from "@clnt/components/common/dynamic-content";
import Loader from "@clnt/components/common/loader";
import { useSidebarStore } from "@clnt/lib/store/sidebar-store";

function HomePageContent() {
  const activeNavName = useSidebarStore((state) => state.activeNavName);
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
          <DynamicContent />
        </SidebarInset>
      </SidebarProvider>
    </>
  );
}

const LazyHomePageContent = React.lazy(() =>
  Promise.resolve({ default: HomePageContent }),
);

export default function HomePage() {
  return (
    <Suspense fallback={<Loader />}>
      <LazyHomePageContent />
    </Suspense>
  );
}
