import Review from "../models/ReviewModel.js";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import User from "../models/UserModel.js";

export const addReview = async (req, res) => {
  const userId = jwt.verify(req.body.token, "secret").id;
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    return res.status(400).json({ msg: "Cannot add review." });
  }

  const count = await Review.count({
    where: { userId: userId, restaurantId: restaurantId },
  });

  if (count > 0) {
    return res.status(400).json({ msg: "Cannot add review." });
  }

  try {
    const response = await Review.create({
      userId: userId,
      restaurantId: restaurantId,
      rating: req.body.rating,
      review: req.body.review,
      isAnonymous: req.body.isAnonymous,
    });
    res.status(200).json({ msg: "Review successfully added." });
  } catch (error) {
    console.log(error);
  }
};

export const deleteReview = async (req, res) => {
  if (req.params.id == 0) {
    return res.status(400).json({ msg: "Review Id cannot be null." });
  }

  var review = Review.findByPk(req.params.id);
  console.log(review);
  if (!review) {
    return res.status(400).json("Review not found.");
  }

  try {
    const response = await Review.destroy({ where: { id: req.params.id } });
    res.status(200).json("Review has deleted succesfully.");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getReviewByRestaurantId = async (req, res) => {
  if (req.params.restaurantId == 0) {
    return res.status(400).json({ msg: "Restaurant Id cannot be null." });
  }

  try {
    const response = await Review.findAndCountAll({
      where: { restaurantId: req.params.restaurantId },
      include: User,
      attributes: [
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

    // Sequelize.query("SELECT ")
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getReviewById = async (req, res) => {
  if (req.params.id == 0) {
    return res.status(400).json({ msg: "Review Id cannot be null." });
  }

  try {
    const response = await Review.findByPk(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getAllReview = async (req, res) => {
  try {
    const response = await Review.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};
