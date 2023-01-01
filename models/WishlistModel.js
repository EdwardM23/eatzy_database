import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import User from "./03UserModel.js";

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

Wishlist.Wishlist = function (userId, restaurantId) {
  Wishlist.create({
    userId: userId,
    restaurantId: restaurantId,
  });
};

Wishlist.checkWishlist = function (userId, restaurantId) {
  const wishlist = Wishlist.findOne({
    where: {
      userId: userId,
      restaurantId: restaurantId,
    },
  });

  return wishlist;
};

Wishlist.deleteWishlist = function (wishlist) {
  wishlist.destroy();
};

export default Wishlist;
