import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const History = db.define(
  "history",
  {
    // user_id: { primaryKey: true, type: DataTypes.INTEGER },
    // restaurant_id: { primaryKey: true, type: DataTypes.INTEGER },
  },
  {
    freezeTableName: true,
  }
);

export default History;
