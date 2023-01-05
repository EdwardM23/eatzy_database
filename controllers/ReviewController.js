import Review from "../models/ReviewModel.js";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import User from "../models/UserModel.js";
import path from "path";
import { uploadToCloudinary } from "../Cloudinary.js";
import Restaurant from "../models/RestaurantModel.js";

export const addReview = async (req, res) => {
  var userId = 0;
  try {
    userId = jwt.verify(req.body.token, "secret").id;
  } catch (erorr) {
    return res.status(401).json({ msg: "Invalid token." });
  }
  const restaurantId = req.body.restaurantId;
  var image;
  var imagePath = "";

  if (!userId || !restaurantId) {
    return res.status(400).json({ msg: "Cannot add review." });
  }

  const count = await Review.count({
    where: { userId: userId, restaurantId: restaurantId },
  });

  if (count > 0) {
    //   return res.status(400).json({ msg: "Cannot add review." });
  }

  if (req.files) {
    image = req.files.file;
    const fileName = image.name;
    const fileSize = image.size;
    const ext = path.extname(fileName);
    const allowedType = [".png", ".jpg", ".jpeg"];
    console.log(req.files);

    if (!allowedType.includes(ext.toLowerCase()))
      return res.status(422).json({ msg: "Invalid Images" });
    if (fileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    try {
      var locaFilePath = image.tempFilePath;
      var result = await uploadToCloudinary(locaFilePath, "review");
      imagePath = result.url;
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  try {
    const response = await Review.create({
      userId: userId,
      restaurantId: restaurantId,
      rating: req.body.rating,
      review: req.body.review,
      isAnonymous: req.body.isAnonymous,
      imageURL: imagePath,
    });
    res.status(200).json({ msg: "Review successfully added." });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const deleteReview = async (req, res) => {
  if (req.params.id == 0) {
    return res.status(400).json({ msg: "Review Id cannot be null." });
  }

  var review = Review.findByPk(req.params.id);
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
    return res.status(400).json({ msg: "Restaurant Id cannot be empty." });
  }

  try {
    const response = await Review.findAndCountAll({
      where: { restaurantId: req.params.restaurantId },
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
      order: [["createdAt", "DESC"]],
    });

    // Sequelize.query("SELECT ")
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getReviewByUserId = async (req, res) => {
  if (req.params.userId == 0) {
    return res.status(400).json({ msg: "User Id cannot be empty." });
  }

  try {
    const response = await Review.findAll({
      attributes: ["id", "review", "rating", "imageURL", "review", "createdAt"],
      include: {
        model: Restaurant,
        attributes: ["name"],
      },
      where: { userId: req.params.userId },
    });

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
    return res.status(400).json(error.message);
  }
};

export const getTopReview = async (req, res) => {
  if (req.params.restaurantId == 0) {
    return res.status(400).json({ msg: "Restaurant Id cannot be empty." });
  }

  try {
    const response = await Review.findAll({
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
      where: { restaurantId: req.params.restaurantId },
      order: [["rating", "DESC"]],
      limit: 2,
      include: {
        model: User,
        attributes: [],
      },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getOverallRating = async (req, res) => {
  if (req.params.restaurantId == 0) {
    return res.status(400).json({ msg: "Restaurant Id cannot be empty." });
  }

  try {
    const response = await Review.findAll({
      attributes: [
        [Sequelize.fn("AVG", Sequelize.col("rating")), "averageRating"],
        [Sequelize.fn("COUNT", Sequelize.col("rating")), "countReview"],
      ],
      where: { restaurantId: req.params.restaurantId },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
