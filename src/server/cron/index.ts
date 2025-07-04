import cron from "node-cron";
import { toggleProjectVisibility } from "./toggle-project-visibility.cron.ts";

// Runs every day at midnight
cron.schedule("0 0 * * *", () => {
  console.log("[CRON] Running toggleProjectVisibility...");
  toggleProjectVisibility();
});
