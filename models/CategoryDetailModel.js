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

CategoryDetail.CategoryDetail = function (categoryId, restaurantId) {
  CategoryDetail.create({
    categoryId: categoryId,
    restaurantId: restaurantId,
  });
};

export default CategoryDetail;
