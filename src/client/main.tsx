import "@clnt/index.css";
import ReactDOM from "react-dom/client";
import App from "@clnt/App";
import { BrowserRouter } from 'react-router'
import { ThemeProvider } from "@clnt/components/theme-provider";
import { AppWrapper } from "@clnt/components/page-meta";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <AppWrapper>
    <BrowserRouter>
      <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </AppWrapper>
);
