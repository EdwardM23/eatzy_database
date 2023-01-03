import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Restaurant from "./RestaurantModel.js";
import Review from "./ReviewModel.js";
import Wishlist from "./WishlistModel.js";
import History from "./HistoryModel.js";
import ForgotPassword from "./ForgotPasswordModel.js";

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
    role: {
      type: DataTypes.STRING(5),
    },
  },
  {
    freezeTableName: true,
  }
);

User.User = function (email, username, password, role) {
  User.create({
    email: email,
    username: username,
    password: password,
    role: role,
  });
};

User.checkUserByEmail = function (email) {
  return User.findOne({
    where: {
      email: email,
    },
  });
};

User.checkUser = function (id) {
  return User.findByPk(id);
};

User.setAsAdmin = function (id) {
  User.update(
    {
      role: "admin",
    },
    { where: { id: id } }
  );
};

User.deleteUser = function (id) {
  User.destroy({ where: { id: id } });
};

User.getAllUser = function () {
  return User.findAll();
};

User.belongsToMany(Restaurant, {
  through: Wishlist,
  // uniqueKey: "user_id",
});
Restaurant.belongsToMany(User, {
  through: Wishlist,
  // uniqueKey: "restaurant_id",
});

User.hasMany(History, { foreignKey: "userId" });
History.belongsTo(User, { foreignKey: "userId" });

User.hasOne(ForgotPassword, { foreignKey: "userId" });
ForgotPassword.belongsTo(User, { foreignKey: "userId" });

Review.belongsTo(User, { foreignKey: "userId" });
User.hasMany(Review, { foreignKey: "userId" });

export default User;
