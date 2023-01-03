import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import CategoryDetail from "./CategoryDetailModel.js";
import Restaurant from "./RestaurantModel.js";

const { DataTypes } = Sequelize;

const Category = db.define(
  "category",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
    },
    isFood: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    freezeTableName: true,
  }
);

export default Category;
