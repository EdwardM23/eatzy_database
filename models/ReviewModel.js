import { Sequelize } from "sequelize";
import database from "../config/Database.js";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Review = db.define(
  "review",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    review: {
      type: DataTypes.STRING(100),
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
    },
    imageURL: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Review;
