import { DocumentShare, AccessLog, User, Document } from "../models/index.js";
import { createError } from "../middleware/error.js";

export async function listViewersWithAccess(documentId: string) {
  return DocumentShare.findAll({
    where: { documentId },
    include: [{ model: User, as: "viewer", attributes: ["id", "name", "email", "wallet"] }],
    order: [["grantedAt", "DESC"]],
  });
}

export async function grantAccess(documentId: string, ownerWallet: string, viewerId: string) {
  // Verify the document belongs to the owner (by wallet)
  const doc = await Document.findOne({ where: { id: documentId, ownerWallet } });
  if (!doc) throw createError("Document not found", 404);

  // Verify viewer exists
  const viewer = await User.findOne({ where: { id: viewerId, persona: "viewer" } });
  if (!viewer) throw createError("Viewer not found", 404);

  const [share, created] = await DocumentShare.findOrCreate({
    where: { documentId, viewerId },
    defaults: { documentId, viewerId },
  });

  if (!created) throw createError("Viewer already has access", 409);
  return share;
}

export async function revokeAccess(documentId: string, ownerWallet: string, viewerId: string) {
  const doc = await Document.findOne({ where: { id: documentId, ownerWallet } });
  if (!doc) throw createError("Document not found", 404);

  const share = await DocumentShare.findOne({ where: { documentId, viewerId } });
  if (!share) throw createError("Share not found", 404);
  await share.destroy();
}

export async function listAccessLogs(documentId: string, ownerWallet: string) {
  const doc = await Document.findOne({ where: { id: documentId, ownerWallet } });
  if (!doc) throw createError("Document not found", 404);

  return AccessLog.findAll({
    where: { documentId },
    include: [{ model: User, as: "viewer", attributes: ["id", "name"] }],
    order: [["accessedAt", "DESC"]],
  });
}

export async function signDocument(documentId: string, viewerId: string, viewerWallet: string, signatureHash: string) {
  // Verify viewer has access
  const share = await DocumentShare.findOne({ where: { documentId, viewerId } });
  if (!share) throw createError("Access not granted", 403);

  return AccessLog.create({
    documentId,
    viewerId,
    viewerWallet,
    signatureHash,
  });
}
