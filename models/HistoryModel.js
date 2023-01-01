import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Category from "./02CategoryModel.js";
import Restaurant from "./05RestaurantModel.js";

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

History.History = function (userId, restaurantId) {
  History.create({
    userId: userId,
    restaurantId: restaurantId,
  });
};

History.update = function (history) {
  history.changed("updatedAt", true);
  history.save();
};

History.checkHistory = function (userId, restaurantId) {
  const history = History.findOne({
    where: { userId: userId, restaurantId: restaurantId },
  });

  return history;
};

History.getLatestHistory = function (userId) {
  const histories = History.findAll({
    where: { userId: userId },
    limit: 10,
    attributes: ["updatedAt"],
    include: [
      {
        model: Restaurant,
        include: {
          attributes: ["name"],
          model: Category,
          through: { attributes: [] },
        },
      },
    ],
    order: [["updatedAt", "DESC"]],
  });

  return histories;
};

export default History;
