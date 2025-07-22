import { Router } from "express";
import { LabController } from "./project-labs.controller.ts";

const router = Router();

router.post("/", LabController.createLab);
router.get("/", LabController.getLabs);
router.get("/:id", LabController.getLab);
router.patch("/:id", LabController.updateLab);
router.delete("/:id", LabController.deleteLab);

export default router;
