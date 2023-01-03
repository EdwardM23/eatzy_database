import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const CategoryDetail = db.define(
  "category_detail",
  {},
  {
    freezeTableName: true,
  }
);

export default CategoryDetail;
