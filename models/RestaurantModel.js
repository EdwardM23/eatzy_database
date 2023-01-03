import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Review from "./ReviewModel.js";
import Wishlist from "./WishlistModel.js";
import CategoryDetail from "./CategoryDetailModel.js";
// import RestaurantDetail from "./RestaurantDetailModel.js";
import User from "./UserModel.js";
import Category from "./CategoryModel.js";
import History from "./HistoryModel.js";

const { DataTypes } = Sequelize;

const Restaurant = db.define(
  "restaurant",
  {
    name: DataTypes.STRING,
    location: DataTypes.GEOMETRY("POINT"),
    address: DataTypes.STRING(100),
    menuURL: DataTypes.STRING,
    imageURL: DataTypes.STRING,
    priceRange: DataTypes.STRING(100),
    schedule: DataTypes.STRING(50),
  },
  {
    freezeTableName: true,
  }
);

Review.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Review, { foreignKey: "restaurantId" });

Restaurant.hasMany(History, { foreignKey: "restaurantId" });
History.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Category.belongsToMany(Restaurant, { through: CategoryDetail });
Restaurant.belongsToMany(Category, { through: CategoryDetail });

export default Restaurant;
