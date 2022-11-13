import { Sequelize } from "sequelize";
import database from "../config/Database.js";
import db from "../config/Database.js";

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
      type: DataTypes.INTEGER,
    },
    review: {
      type: DataTypes.TEXT,
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Review;

(async () => {
  await db.sync();
})();
