import { Collection, Document } from "../models/index.js";
import { createError } from "../middleware/error.js";

export async function listCollections(creatorId: string) {
  return Collection.findAll({
    where: { creatorId },
    include: [{ model: Document, as: "documents", attributes: ["id"] }],
    order: [["createdAt", "DESC"]],
  });
}

export async function getCollection(id: string, creatorId: string) {
  const collection = await Collection.findOne({
    where: { id, creatorId },
    include: [{ model: Document, as: "documents" }],
  });
  if (!collection) throw createError("Collection not found", 404);
  return collection;
}

export async function createCollection(data: {
  name: string;
  description?: string;
  creatorId: string;
  onchainCollectionId?: string;
}) {
  return Collection.create({
    name: data.name,
    description: data.description ?? null,
    creatorId: data.creatorId,
    onchainCollectionId: data.onchainCollectionId ?? null,
  });
}

export async function updateCollection(
  id: string,
  creatorId: string,
  data: { name?: string; description?: string }
) {
  const collection = await Collection.findOne({ where: { id, creatorId } });
  if (!collection) throw createError("Collection not found", 404);
  return collection.update(data);
}

export async function deleteCollection(id: string, creatorId: string) {
  const collection = await Collection.findOne({ where: { id, creatorId } });
  if (!collection) throw createError("Collection not found", 404);
  await collection.destroy();
}
