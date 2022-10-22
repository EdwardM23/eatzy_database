import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Restaurant = db.define(
  "restaurants",
  {
    name: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    address: DataTypes.TEXT,
    openTime: DataTypes.TIME,
    closeTime: DataTypes.TIME,
    image: DataTypes.STRING,
    imageURL: DataTypes.STRING,
  },
  {
    freezeTableName: true,
  }
);

export default Restaurant;

(async () => {
  await db.sync();
})();
