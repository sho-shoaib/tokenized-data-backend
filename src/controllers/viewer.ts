import type { Request, Response, NextFunction } from "express";
import * as viewerService from "../services/viewer.js";

export async function listViewers(_req: Request, res: Response, next: NextFunction) {
  try {
    const viewers = await viewerService.listViewers();
    res.json(viewers);
  } catch (err) {
    next(err);
  }
}

export async function myDocuments(req: Request, res: Response, next: NextFunction) {
  try {
    const shares = await viewerService.listDocumentsSharedWithViewer(req.user!.userId);
    res.json(shares);
  } catch (err) {
    next(err);
  }
}
