import Review from "../models/ReviewModel.js";
import jwt from "jsonwebtoken";
import { Sequelize } from "sequelize";
import User from "../models/UserModel.js";
import path from "path";
import { uploadToCloudinary } from "../Cloudinary.js";

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

  const review = await Review.checkReview(userId, restaurantId);

  if (review) {
    return res
      .status(400)
      .json({ msg: "You've already post a review before." });
  }

  if (req.files) {
    image = req.files.file;
    const fileName = image.name;
    const fileSize = image.size;
    const ext = path.extname(fileName);
    const allowedType = [".png", ".jpg", ".jpeg"];

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
    await Review.Review(
      userId,
      restaurantId,
      req.body.rating,
      req.body.review,
      req.body.isAnonymous,
      imagePath
    );
    res.status(200).json({ msg: "Review successfully added." });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const deleteReview = async (req, res) => {
  if (req.params.id == 0) {
    return res.status(400).json({ msg: "Review Id cannot be null." });
  }

  var review = await Review.checkReviewByPk(req.params.id);
  if (!review) {
    return res.status(400).json({ msg: "Review not found." });
  }

  try {
    const response = await Review.deleteReview(req.params.id);
    res.status(200).json({ msg: "Review has deleted succesfully." });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getReviewByRestaurantId = async (req, res) => {
  if (req.params.restaurantId == 0) {
    return res.status(400).json({ msg: "Restaurant Id cannot be empty." });
  }

  try {
    const response = await Review.getReviewByRestaurantId(
      req.params.restaurantId
    );

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
    const response = await Review.checkReviewByPk(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getAllReview = async (req, res) => {
  try {
    const response = await Review.getAll();
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
    const response = await Review.getTopReview(req.params.restaurantId);
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
    const response = await Review.getOverallRating(req.params.restaurantId);
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
