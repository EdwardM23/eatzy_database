import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Station from "./StationModel.js";

const { DataTypes } = Sequelize;

const StationType = db.define(
  "station_type",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING(30) },
    image: { type: DataTypes.TEXT },
  },
  {
    freezeTableName: true,
  }
);

StationType.hasMany(Station, {
  foreignKey: "stationTypeId",
});
Station.belongsTo(StationType, { foreignKey: "stationTypeId" });

export default StationType;
