import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import RestaurantDetail from "./RestaurantDetailModel.js";
import Restaurant from "./05RestaurantModel.js";
import StationType from "./01StationTypeModel.js";
const Op = Sequelize.Op;

const { DataTypes } = Sequelize;

const Station = db.define(
  "station",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: DataTypes.STRING(100),
    location: { type: DataTypes.GEOMETRY("POINT"), allowNull: false },
  },
  {
    freezeTableName: true,
  }
);

Station.Station = function (name, longitude, latitude, stationTypeId) {
  const point = { type: "Point", coordinates: [longitude, latitude] };
  return Station.create({
    name: name,
    location: point,
    stationTypeId: stationTypeId,
  });
};

Station.checkStation = function (id) {
  return Station.findByPk(id);
};

Station.getStationByKeyword = function (keyword) {
  return Station.findAll({
    include: [{ model: StationType }],
    where: { name: { [Op.substring]: keyword } },
  });
};

Station.getAllStation = function () {
  return Station.findAll({ include: [{ model: StationType }] });
};

Station.deleteStation = function (id) {
  Station.destroy({
    where: {
      id: id,
    },
  });
};

Station.editStation = function (station, name, stationTypeId) {
  if (name) station.name = req.body.name;
  if (stationTypeId) station.stationTypeId = stationTypeId;

  station.save();
};

StationType.hasMany(Station, {
  foreignKey: "stationTypeId",
});
Station.belongsTo(StationType, { foreignKey: "stationTypeId" });

export default Station;
