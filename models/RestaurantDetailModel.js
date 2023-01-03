import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const RestaurantDetail = db.define(
  "restaurant_detail",
  {
    // station_id: { primaryKey: true, type: DataTypes.INTEGER },
    // restaurant_id: { primaryKey: true, type: DataTypes.INTEGER },
    walkDistance: { type: DataTypes.FLOAT },
  },
  {
    freezeTableName: true,
  }
);

export default RestaurantDetail;
