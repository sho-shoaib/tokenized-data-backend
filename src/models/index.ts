import { User } from "./User.js";
import { Collection } from "./Collection.js";
import { Document } from "./Document.js";
import { DocumentShare } from "./DocumentShare.js";
import { AccessLog } from "./AccessLog.js";

// User → Collection (creator has many collections)
User.hasMany(Collection, { foreignKey: "creatorId", as: "collections" });
Collection.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// Collection → Document
Collection.hasMany(Document, { foreignKey: "collectionId", as: "documents" });
Document.belongsTo(Collection, { foreignKey: "collectionId", as: "collection" });

// User (creator) → Document
User.hasMany(Document, { foreignKey: "creatorId", as: "mintedDocuments" });
Document.belongsTo(User, { foreignKey: "creatorId", as: "creator" });

// Document → DocumentShare
Document.hasMany(DocumentShare, { foreignKey: "documentId", as: "shares" });
DocumentShare.belongsTo(Document, { foreignKey: "documentId", as: "document" });

// User (viewer) → DocumentShare
User.hasMany(DocumentShare, { foreignKey: "viewerId", as: "sharedDocuments" });
DocumentShare.belongsTo(User, { foreignKey: "viewerId", as: "viewer" });

// Document → AccessLog
Document.hasMany(AccessLog, { foreignKey: "documentId", as: "accessLogs" });
AccessLog.belongsTo(Document, { foreignKey: "documentId", as: "document" });

// User (viewer) → AccessLog
User.hasMany(AccessLog, { foreignKey: "viewerId", as: "accessLogs" });
AccessLog.belongsTo(User, { foreignKey: "viewerId", as: "viewer" });

export { User, Collection, Document, DocumentShare, AccessLog };
