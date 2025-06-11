import "@clnt/index.css";
import ReactDOM from "react-dom/client";
import App from "@clnt/App";
import { BrowserRouter } from "react-router";
import { ThemeProvider } from "@clnt/components/theme-provider";
import { AppWrapper } from "@clnt/components/page-meta";
import { Toaster } from "@clnt/components/ui/sonner";
import { TooltipProvider } from "@clnt/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <QueryClientProvider client={queryClient}>
    <AppWrapper>
      <BrowserRouter>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <TooltipProvider>
            <App />
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
          </TooltipProvider>
        </ThemeProvider>
      </BrowserRouter>
    </AppWrapper>
  </QueryClientProvider>,
);
