import "@clnt/index.css";
import ReactDOM from "react-dom/client";
import App from "@clnt/App";
import { ThemeProvider } from "@clnt/components/common/theme-provider";
import { AppWrapper } from "@clnt/components/common/page-meta";
import { Toaster } from "@clnt/components/ui/sonner";
import { TooltipProvider } from "@clnt/components/ui/tooltip";
import { QueryClient } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const asyncStoragePersister = createAsyncStoragePersister({
  key: "Gns3Client",
  storage: localStorage,
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <PersistQueryClientProvider
    client={queryClient}
    persistOptions={{ persister: asyncStoragePersister }}
  >
    <AppWrapper>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <TooltipProvider>
          <App />
          <Toaster />
          <ReactQueryDevtools initialIsOpen={true} />
        </TooltipProvider>
      </ThemeProvider>
    </AppWrapper>
  </PersistQueryClientProvider>,
);
