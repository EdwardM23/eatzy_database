import express from "express";
import {
  addReview,
  deleteReview,
  getAllReview,
  getReviewById,
  getReviewByRestaurantId,
  getTopReview,
} from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/review", getAllReview);
router.get("/review/restaurant/:restaurantId", getReviewByRestaurantId);
router.get("/review/:id", getReviewById);
router.post("/review/", addReview);
router.delete("/review/:id", deleteReview);
router.get("/review/top/:restaurantId", getTopReview);

export default router;
