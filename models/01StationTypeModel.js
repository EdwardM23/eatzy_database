import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Station from "./04StationModel.js";

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

StationType.StationType = function (name, imagePath) {
  StationType.create({
    name: name,
    image: imagePath,
  });
};

StationType.getAllStationType = function () {
  return StationType.findAll();
};

StationType.checkStationType = function (id) {
  return StationType.findByPk(id);
};

StationType.deleteStationType = function (id) {
  StationType.destroy({
    where: {
      id: id,
    },
  });
};

export default StationType;
