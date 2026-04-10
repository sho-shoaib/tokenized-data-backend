import { User, DocumentShare, Document, Collection } from "../models/index.js";

export async function listViewers() {
  return User.findAll({
    where: { persona: "viewer" },
    attributes: ["id", "name", "email", "wallet"],
  });
}

export async function listDocumentsSharedWithViewer(viewerId: string) {
  return DocumentShare.findAll({
    where: { viewerId },
    include: [
      {
        model: Document,
        as: "document",
        include: [
          { model: Collection, as: "collection", attributes: ["id", "name"] },
          { model: User, as: "creator", attributes: ["id", "name"] },
        ],
      },
    ],
    order: [["grantedAt", "DESC"]],
  });
}
