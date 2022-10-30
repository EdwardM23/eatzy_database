import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const StationCategory = db.define(
  "stationCategory",
  {
    name: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default StationCategory;

(async () => {
  await db.sync();
})();
