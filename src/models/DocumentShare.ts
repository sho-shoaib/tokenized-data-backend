import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface DocumentShareAttributes {
  id: string;
  documentId: string;
  viewerId: string;
  grantedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type DocumentShareCreationAttributes = Optional<DocumentShareAttributes, "id" | "grantedAt">;

export class DocumentShare extends Model<DocumentShareAttributes, DocumentShareCreationAttributes> implements DocumentShareAttributes {
  declare id: string;
  declare documentId: string;
  declare viewerId: string;
  declare grantedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

DocumentShare.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    documentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    viewerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    grantedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "document_shares",
    indexes: [
      {
        unique: true,
        fields: ["document_id", "viewer_id"],
      },
    ],
  }
);
