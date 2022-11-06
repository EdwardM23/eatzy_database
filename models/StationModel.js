import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import StationCategory from "./StationCategoryModel.js";

const { DataTypes } = Sequelize;

const Station = db.define(
  "station",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    location: DataTypes.GEOMETRY("POINT"),
    category_id: {
      type: DataTypes.INTEGER,
      references: {
        model: StationCategory,
        key: "id",
      },
    },
  },
  {
    freezeTableName: true,
  }
);

export default Station;

(async () => {
  await db.sync();
})();
