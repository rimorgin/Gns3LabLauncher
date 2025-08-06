import { Router } from "express";
import { LabController } from "./project-labs.controller.ts";
import {
  checkAuthentication,
  checkPermission,
} from "@srvr/middlewares/auth.middleware.ts";
import { labSchema } from "@srvr/utils/validators/lab.schema.ts";
import { validateData } from "@srvr/middlewares/validation.middleware.ts";

const router = Router();

router.post(
  "/",
  validateData(labSchema),
  checkAuthentication,
  checkPermission(["create_project-labs"]),
  LabController.createLab,
);
router.get(
  "/",
  checkAuthentication,
  checkPermission(["read_project-labs"]),
  LabController.getLabs,
);
router.get(
  "/:id",
  checkAuthentication,
  checkPermission(["read_project-labs"]),
  LabController.getLab,
);
router.patch(
  "/:id",
  validateData(labSchema),
  checkAuthentication,
  checkPermission(["update_project-labs"]),
  LabController.updateLab,
);
router.delete(
  "/:id",
  checkAuthentication,
  checkPermission(["delete_project-labs"]),
  LabController.deleteLab,
);

export default router;
