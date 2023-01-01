import { QueryTypes, Sequelize } from "sequelize";
import db from "../config/Database.js";
import Review from "./ReviewModel.js";
import CategoryDetail from "./CategoryDetailModel.js";
import Category from "./02CategoryModel.js";
import History from "./HistoryModel.js";
import Station from "./04StationModel.js";
import RestaurantDetail from "./RestaurantDetailModel.js";

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

Restaurant.getRestaurant = function (restaurantId) {
  const restaurant = Restaurant.findOne({
    include: {
      model: Category,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
    where: { id: restaurantId },
  });

  return restaurant;
};

Restaurant.Restaurant = function (
  name,
  longitude,
  latitude,
  menuPath,
  address,
  imagePath,
  priceRange,
  schedule
) {
  const point = { type: "Point", coordinates: [longitude, latitude] };

  return Restaurant.create({
    name: name,
    location: point,
    menuURL: menuPath,
    address: address,
    imageURL: imagePath,
    priceRange: priceRange,
    schedule: schedule,
  });
};

Restaurant.filterMultipleCategories = function (resCond) {
  return db.query(
    "SELECT `restaurantId` FROM `category_detail` " +
      resCond +
      " GROUP BY `restaurantId`",
    {
      type: QueryTypes.SELECT,
    }
  );
};

Restaurant.getAllRestaurantId = function () {
  return db.query("SELECT `id` FROM `restaurant`", {
    type: QueryTypes.SELECT,
  });
};

Restaurant.checkRestaurant = function (id) {
  return Restaurant.findByPk(id);
};

Restaurant.getRestaurantInfo = function (id) {
  return Restaurant.findOne({
    include: {
      model: Category,
      attributes: ["name"],
      through: {
        attributes: [],
      },
    },
    where: { id: id },
  });
};

Restaurant.getNearestRestaurant = function (filterRestId, stationId) {
  return Station.findAll({
    include: {
      // subQuery: false,
      model: Restaurant,
      include: [
        {
          model: Category,
          attributes: ["name"],
          through: {
            attributes: [],
          },
        },
      ],
      through: {
        attributes: ["walkDistance"],
      },
      where: { id: filterRestId },
    },
    order: [
      [
        Sequelize.literal("`restaurants->restaurant_detail`.`walkDistance`"),
        "ASC",
      ],
    ],
    where: { id: stationId },
  });
};

Restaurant.deleteRestaurant = function (restaurant) {
  restaurant.destroy();
};

Restaurant.updateRestaurantInfo = function (
  restaurant,
  name,
  address,
  priceRange,
  schedule
) {
  if (name) restaurant.name = name;
  if (address) restaurant.address = address;
  if (priceRange) restaurant.priceRange = priceRange;
  if (schedule) restaurant.schedule = schedule;

  restaurant.save();
};

Restaurant.updateImage = function (restaurant, imagePath) {
  if (imagePath) restaurant.imageURL = imagePath;

  restaurant.save();
};

Restaurant.updateMenu = function (restaurant, menuPath) {
  restaurant.menuURL = menuPath;

  restaurant.save();
};

Station.belongsToMany(Restaurant, { through: RestaurantDetail });
Restaurant.belongsToMany(Station, { through: RestaurantDetail });

Review.belongsTo(Restaurant, { foreignKey: "restaurantId" });
Restaurant.hasMany(Review, { foreignKey: "restaurantId" });

Restaurant.hasMany(History, { foreignKey: "restaurantId" });
History.belongsTo(Restaurant, { foreignKey: "restaurantId" });

Category.belongsToMany(Restaurant, { through: CategoryDetail });
Restaurant.belongsToMany(Category, { through: CategoryDetail });

export default Restaurant;
