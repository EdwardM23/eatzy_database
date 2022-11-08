import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const StationCategory = db.define(
  "station_category",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING },
    image: { type: DataTypes.STRING },
    url: { type: DataTypes.STRING },
  },
  {
    freezeTableName: true,
  }
);

export default StationCategory;

(async () => {
  await db.sync();
})();
