import type { Request, Response, NextFunction } from "express";
import * as documentService from "../services/document.js";
import { createDocumentSchema } from "../validators/document.js";

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    console.log(req.body);

    const data = createDocumentSchema.parse(req.body);
    const fileUrl = data.fileUrl || null;
    const doc = await documentService.createDocument({
      ...data,
      fileUrl,
      creatorId: req.user!.userId,
    });
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const { persona, userId, wallet } = req.user!;
    if (persona === "creator") {
      const docs = await documentService.listDocumentsByCreatorId(userId);
      res.json(docs);
      return;
    }
    if (!wallet) {
      res
        .status(400)
        .json({ message: "No wallet associated with this account" });
      return;
    }
    const docs = await documentService.listDocumentsByOwnerWallet(wallet);
    res.json(docs);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const doc = await documentService.getDocument(req.params["id"] as string);
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await documentService.deleteDocument(
      req.params["id"] as string,
      req.user!.userId,
    );
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function mint(req: Request, res: Response, next: NextFunction) {
  try {
    const { tokenId, contractAddress, txHash, onchainTokenId } = req.body as {
      tokenId: number;
      contractAddress: string;
      txHash: string;
      onchainTokenId?: string;
    };
    const doc = await documentService.mintDocument(
      req.params["id"] as string,
      req.user!.userId,
      {
        tokenId,
        contractAddress,
        txHash,
        onchainTokenId,
      },
    );
    res.json(doc);
  } catch (err) {
    next(err);
  }
}

export async function getOwners(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { ownerWallet } = req.params;
    const owners = await documentService.getOwnersByWallet(
      ownerWallet as string,
    );
    res.json({ owners });
  } catch (err) {
    next(err);
  }
}
