import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface AccessLogAttributes {
  id: string;
  documentId: string;
  viewerId: string;
  viewerWallet: string;
  signatureHash: string;
  accessedAt: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

type AccessLogCreationAttributes = Optional<AccessLogAttributes, "id" | "accessedAt">;

export class AccessLog extends Model<AccessLogAttributes, AccessLogCreationAttributes> implements AccessLogAttributes {
  declare id: string;
  declare documentId: string;
  declare viewerId: string;
  declare viewerWallet: string;
  declare signatureHash: string;
  declare accessedAt: Date;
  declare createdAt: Date;
  declare updatedAt: Date;
}

AccessLog.init(
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
    viewerWallet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    signatureHash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    accessedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    tableName: "access_logs",
  }
);
