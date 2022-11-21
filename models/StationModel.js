import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import RestaurantDetail from "./RestaurantDetailModel.js";
import Restaurant from "./RestaurantModel.js";

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

Station.belongsToMany(Restaurant, { through: RestaurantDetail });
Restaurant.belongsToMany(Station, { through: RestaurantDetail });

export default Station;
