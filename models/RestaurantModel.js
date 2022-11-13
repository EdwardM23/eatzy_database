import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Restaurant = db.define(
  "restaurant",
  {
    name: DataTypes.STRING,
    location: DataTypes.GEOMETRY("POINT"),
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

// (async () => {
//   await db.sync();
// })();

export default Restaurant;
