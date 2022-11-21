import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Restaurant from "./RestaurantModel.js";
import Review from "./ReviewModel.js";
import Wishlist from "./WishlistModel.js";

const { DataTypes } = Sequelize;

const User = db.define(
  "user",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    username: {
      type: DataTypes.STRING(20),
    },
    email: {
      type: DataTypes.STRING(30),
    },
    password: {
      type: DataTypes.STRING,
    },
  },
  {
    freezeTableName: true,
  }
);

User.belongsToMany(Restaurant, {
  through: Wishlist,
  // uniqueKey: "user_id",
});

Restaurant.belongsToMany(User, {
  through: Wishlist,
  // uniqueKey: "restaurant_id",
});

Review.belongsTo(User, { foreignKey: "user_id" });
User.hasMany(Review, { foreignKey: "user_id" });

export default User;
