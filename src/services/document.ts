import { Document, Collection, User } from "../models/index.js";
import { createError } from "../middleware/error.js";
import type { DocumentCategory, FileType } from "../models/Document.js";

export async function createDocument(data: {
  collectionId: string;
  title: string;
  description?: string;
  category: DocumentCategory;
  fileType: FileType;
  ownerWallet: string;
  ownerEmail: string;
  fileUrl: string | null;
  creatorId: string;
}) {
  // Verify collection belongs to creator
  const collection = await Collection.findOne({
    where: { id: data.collectionId, creatorId: data.creatorId },
  });
  if (!collection) throw createError("Collection not found", 404);

  console.log(data.fileUrl);
  console.log(data.ownerEmail);

  return Document.create({
    collectionId: data.collectionId,
    title: data.title,
    description: data.description ?? null,
    category: data.category,
    fileType: data.fileType,
    ownerWallet: data.ownerWallet,
    ownerEmail: data.ownerEmail,
    fileUrl: data.fileUrl,
    status: "pending",
    creatorId: data.creatorId,
  });
}

export async function listDocumentsByOwnerWallet(ownerWallet: string) {
  return Document.findAll({
    where: { ownerWallet },
    include: [
      { model: Collection, as: "collection", attributes: ["id", "name"] },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
}

export async function listDocumentsByCreatorId(creatorId: string) {
  return Document.findAll({
    where: { creatorId },
    include: [
      { model: Collection, as: "collection", attributes: ["id", "name"] },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
    order: [["createdAt", "DESC"]],
  });
}

export async function getDocument(id: string) {
  const doc = await Document.findByPk(id, {
    include: [
      { model: Collection, as: "collection", attributes: ["id", "name"] },
      { model: User, as: "creator", attributes: ["id", "name"] },
    ],
  });
  if (!doc) throw createError("Document not found", 404);
  return doc;
}

export async function deleteDocument(id: string, creatorId: string) {
  const doc = await Document.findOne({ where: { id, creatorId } });
  if (!doc) throw createError("Document not found", 404);
  await doc.destroy();
}

export async function mintDocument(
  id: string,
  creatorId: string,
  data: {
    tokenId: number;
    contractAddress: string;
    txHash: string;
    onchainTokenId?: string;
  },
) {
  const doc = await Document.findOne({ where: { id, creatorId } });
  if (!doc) throw createError("Document not found", 404);
  return doc.update({ ...data, status: "minted" });
}

export async function getOwnersByWallet(ownerWallet: string) {
  return User.findAll({
    where: { wallet: ownerWallet, persona: "owner" },
    attributes: ["email"],
  });
}
