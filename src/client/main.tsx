import "@clnt/index.css";
import ReactDOM from "react-dom/client";
import App from "@clnt/App";
import { ThemeProvider } from "@clnt/components/theme-provider";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
    <App />
  </ThemeProvider>
);
