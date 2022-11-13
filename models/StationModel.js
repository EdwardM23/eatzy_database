import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import StationCategory from "./StationCategoryModel.js";

const { DataTypes } = Sequelize;

const Station = db.define(
  "station",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING,
    location: { type: DataTypes.GEOMETRY("POINT"), allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

// Station.belongsTo(StationCategory, { foreignKey: "station_category_id" });

// async () => {
//   await db.sync();
// };

export default Station;
