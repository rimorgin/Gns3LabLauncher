import { Router } from "express";
import { getDockerStats } from "./system-stats.controller.ts";

const router = Router();

router.get("/docker-stat", getDockerStats);

export default router;
