import { Sequelize } from "sequelize";
import database from "../config/Database.js";
import db from "../config/Database.js";
import User from "./03UserModel.js";

const { DataTypes } = Sequelize;

const Review = db.define(
  "review",
  {
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    rating: {
      type: DataTypes.FLOAT,
    },
    review: {
      type: DataTypes.STRING(150),
    },
    isAnonymous: {
      type: DataTypes.BOOLEAN,
    },
    imageURL: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
  }
);

Review.Review = function (
  userId,
  restaurantId,
  rating,
  review,
  isAnonymous,
  imagePath
) {
  Review.create({
    userId: userId,
    restaurantId: restaurantId,
    rating: rating,
    review: review,
    isAnonymous: isAnonymous,
    imageURL: imagePath,
  });
};

Review.checkReview = function (userId, restaurantId) {
  const review = Review.findOne({
    where: { userId: userId, restaurantId: restaurantId },
  });

  return review;
};

Review.checkReviewByPk = function (id) {
  return Review.findByPk(id);
};

Review.deleteReview = function (id) {
  Review.destroy({ where: { id: id } });
};

Review.getReviewByRestaurantId = function (restaurantId) {
  return Review.findAndCountAll({
    where: { restaurantId: restaurantId },
    include: User,
    attributes: [
      "id",
      "review",
      "rating",
      "imageURL",
      "review",
      "createdAt",
      [
        Sequelize.literal(
          `CASE review.isAnonymous WHEN 1 THEN CONCAT(SUBSTRING(user.username, 1, 2), '***') ELSE user.username END`
        ),
        "username",
      ],
    ],
  });
};

Review.getAll = function () {
  return Review.findAll();
};

Review.getTopReview = function (restaurantId) {
  return Review.findAll({
    attributes: [
      "id",
      "review",
      "rating",
      "imageURL",
      "review",
      "createdAt",
      [
        Sequelize.literal(
          `CASE review.isAnonymous WHEN 1 THEN CONCAT(SUBSTRING(user.username, 1, 2), '***') ELSE user.username END`
        ),
        "username",
      ],
    ],
    where: { restaurantId: restaurantId },
    order: [["rating", "DESC"]],
    limit: 2,
    include: {
      model: User,
      attributes: [],
    },
  });
};

Review.getOverallRating = function (restaurantId) {
  return Review.findAll({
    attributes: [
      [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
      [Sequelize.fn("COUNT", Sequelize.col("rating")), "countReview"],
    ],
    where: { restaurantId: restaurantId },
  });
};

export default Review;
