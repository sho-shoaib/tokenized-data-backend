import type { Request, Response, NextFunction } from "express";
import * as accessService from "../services/access.js";
import { grantAccessSchema, signDocumentSchema } from "../validators/access.js";

export async function listViewers(req: Request, res: Response, next: NextFunction) {
  try {
    const shares = await accessService.listViewersWithAccess(req.params["id"] as string);
    res.json(shares);
  } catch (err) {
    next(err);
  }
}

export async function grant(req: Request, res: Response, next: NextFunction) {
  try {
    const { viewerId } = grantAccessSchema.parse(req.body);
    const share = await accessService.grantAccess(
      req.params["id"] as string,
      req.user!.wallet!,
      viewerId
    );
    res.status(201).json(share);
  } catch (err) {
    next(err);
  }
}

export async function revoke(req: Request, res: Response, next: NextFunction) {
  try {
    await accessService.revokeAccess(
      req.params["id"] as string,
      req.user!.wallet!,
      req.params["viewerId"] as string
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function listLogs(req: Request, res: Response, next: NextFunction) {
  try {
    const logs = await accessService.listAccessLogs(req.params["id"] as string, req.user!.wallet!);
    res.json(logs);
  } catch (err) {
    next(err);
  }
}

export async function sign(req: Request, res: Response, next: NextFunction) {
  try {
    const { signatureHash } = signDocumentSchema.parse(req.body);
    const log = await accessService.signDocument(
      req.params["id"] as string,
      req.user!.userId,
      req.user!.wallet ?? "",
      signatureHash
    );
    res.status(201).json(log);
  } catch (err) {
    next(err);
  }
}
