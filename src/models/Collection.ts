import { DataTypes, Model } from "sequelize";
import type { Optional } from "sequelize";
import { sequelize } from "../config/database.js";

export interface CollectionAttributes {
  id: string;
  name: string;
  description: string | null;
  creatorId: string;
  onchainCollectionId: string | null;
  createdAt?: Date;
  updatedAt?: Date;
}

type CollectionCreationAttributes = Optional<CollectionAttributes, "id" | "description" | "onchainCollectionId">;

export class Collection extends Model<CollectionAttributes, CollectionCreationAttributes> implements CollectionAttributes {
  declare id: string;
  declare name: string;
  declare description: string | null;
  declare creatorId: string;
  declare onchainCollectionId: string | null;
  declare createdAt: Date;
  declare updatedAt: Date;
}

Collection.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
      defaultValue: null,
    },
    creatorId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    onchainCollectionId: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    sequelize,
    tableName: "collections",
  }
);
