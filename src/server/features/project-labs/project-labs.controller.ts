import { Request, Response } from "express";
import { LabService } from "./project-labs.service.ts";

export class LabController {
  static async createLab(req: Request, res: Response) {
    try {
      const lab = await LabService.createLab(req.body);
      res.status(201).json(lab);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to create lab" });
    }
  }

  static async getLab(req: Request, res: Response) {
    const { id } = req.params;
    const lab = await LabService.getLabById(id);
    if (!lab) {
      res.status(404).json({ error: "Lab not found" });
      return;
    }
    res.json(lab);
  }

  static async getLabs(req: Request, res: Response) {
    const labs = await LabService.getAllLabs();
    res.json(labs);
  }

  static async updateLab(req: Request, res: Response) {
    const { id } = req.params;
    try {
      console.log(req.body);
      const lab = await LabService.updateLab(id, req.body);
      res.json(lab);
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to update lab" });
    }
  }

  static async deleteLab(req: Request, res: Response) {
    const { id } = req.params;
    try {
      await LabService.deleteLab(id);
      res.status(204).send();
    } catch (err) {
      console.error(err);
      res.status(400).json({ error: "Failed to delete lab" });
    }
  }
}
