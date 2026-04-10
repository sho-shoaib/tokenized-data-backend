import type { Request, Response, NextFunction } from "express";
import * as collectionService from "../services/collection.js";
import { createCollectionSchema, updateCollectionSchema } from "../validators/collection.js";

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const collections = await collectionService.listCollections(req.user!.userId);
    res.json(collections);
  } catch (err) {
    next(err);
  }
}

export async function getOne(req: Request, res: Response, next: NextFunction) {
  try {
    const collection = await collectionService.getCollection(req.params["id"] as string, req.user!.userId);
    res.json(collection);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = createCollectionSchema.parse(req.body);
    const collection = await collectionService.createCollection({
      ...data,
      creatorId: req.user!.userId,
    });
    res.status(201).json(collection);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const data = updateCollectionSchema.parse(req.body);
    const collection = await collectionService.updateCollection(req.params["id"] as string, req.user!.userId, data);
    res.json(collection);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    await collectionService.deleteCollection(req.params["id"] as string, req.user!.userId);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
