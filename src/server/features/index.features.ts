import { Express } from "express";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import webSocketListener from "./websocket/websocket.handler.ts";

/**
 * Dynamically registers all feature-based route modules found in the `/features` directory.
 * Each feature folder should contain a file named `{feature}.route.ts` which exports an Express Router.
 *
 * Example:
 * - Feature path: `/features/classrooms/classrooms.route.ts`
 * - Registered feature: `/api/v1/classrooms`
 *
 * @param {express.Application} app - The Express application instance used to mount routes
 * @returns {Promise<void>} - A promise that resolves once all routes are registered
 */
const registerFeatures = async (app: Express) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const featureDir = __dirname;

  const files = fs.readdirSync(featureDir);

  for (const file of files) {
    const fullPath = path.join(featureDir, file);

    // Only process directories
    if (fs.statSync(fullPath).isDirectory()) {
      const routeFileName = `${file}.route.ts`;
      const routeFilePath = path.join(fullPath, routeFileName);

      // Check if route file exists
      if (fs.existsSync(routeFilePath)) {
        try {
          // Import route module dynamically
          const featureModule = await import(`./${file}/${file}.route`);
          const featureRouter = featureModule.default;

          if (featureRouter) {
            const routePath = `/api/v1/${file}`;
            app.use(routePath, featureRouter);
            console.log(`✅ Registered feature: ${routePath}`);
          }
        } catch (err) {
          console.warn(`⚠️ No route found for feature: ${file}`, err);
        }
      }
    }
  }
};

export const registerWsFeature = () => {
  webSocketListener();
};

export default registerFeatures;
