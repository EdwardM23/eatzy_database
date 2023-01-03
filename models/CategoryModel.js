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

Category.Category = function (name, isFood) {
  Category.create({
    name: name,
    isFood: isFood,
  });
};

Category.getCuisineCategory = function () {
  const categories = Category.findAll({
    where: {
      isFood: false,
    },
  });

  return categories;
};

Category.getFoodCategory = function () {
  const categories = Category.findAll({
    where: {
      isFood: true,
    },
  });

  return categories;
};

Category.deleteCategory = function (id) {
  Category.destroy({
    where: {
      id: id,
    },
  });
};

Category.getAllCategories = function () {
  const categories = Category.findAll({
    order: [["name", "ASC"]],
  });

  return categories;
};

export default Category;
