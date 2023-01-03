import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./UserModel.js";

const { DataTypes } = Sequelize;

const Wishlist = db.define(
  "wishlist",
  {
    // user_id: { primaryKey: true, type: DataTypes.INTEGER },
    // restaurant_id: { primaryKey: true, type: DataTypes.INTEGER },
  },
  {
    freezeTableName: true,
  }
);

export default Wishlist;
