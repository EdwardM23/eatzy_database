import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Station from "./StationModel.js";

const { DataTypes } = Sequelize;

const StationCategory = db.define(
  "station_category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.TEXT },
  },
  {
    freezeTableName: true,
  }
);

StationCategory.hasMany(Station, {
  foreignKey: "station_category_id",
});
Station.belongsTo(StationCategory, { foreignKey: "station_category_id" });

// (async () => {
//   await db.sync();
// })();

export default StationCategory;
