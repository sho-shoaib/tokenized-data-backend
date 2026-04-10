import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export type DocumentCategory = "Contract" | "Report" | "Certificate" | "Invoice" | "Dataset" | "Other";
export type FileType = "pdf" | "image" | "docx";
export type DocumentStatus = "pending" | "minted";

export interface DocumentAttributes {
  id: string;
  collectionId: string;
  title: string;
  description: string | null;
  category: DocumentCategory;
  fileType: FileType;
  fileUrl: string | null;
  status: DocumentStatus;
  ownerWallet: string;
  tokenId: number | null;
  contractAddress: string | null;
  txHash: string | null;
  onchainTokenId: string | null;
  creatorId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

type DocumentCreationAttributes = Optional<
  DocumentAttributes,
  "id" | "description" | "fileUrl" | "status" | "tokenId" | "contractAddress" | "txHash" | "onchainTokenId"
>;

export class Document extends Model<DocumentAttributes, DocumentCreationAttributes> implements DocumentAttributes {
  declare id: string;
  declare collectionId: string;
  declare title: string;
  declare description: string | null;
  declare category: DocumentCategory;
  declare fileType: FileType;
  declare fileUrl: string | null;
  declare status: DocumentStatus;
  declare ownerWallet: string;
  declare tokenId: number | null;
  declare contractAddress: string | null;
  declare txHash: string | null;
  declare onchainTokenId: string | null;
  declare creatorId: string;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Document.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    collectionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    category: {
      type: DataTypes.ENUM("Contract", "Report", "Certificate", "Invoice", "Dataset", "Other"),
      allowNull: false,
    },
    fileType: {
      type: DataTypes.ENUM("pdf", "image", "docx"),
      allowNull: false,
    },
    fileUrl: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    status: {
      type: DataTypes.ENUM("pending", "minted"),
      allowNull: false,
      defaultValue: "pending",
    },
    ownerWallet: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    tokenId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: null,
    },
    contractAddress: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    txHash: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    onchainTokenId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "documents",
  }
);
