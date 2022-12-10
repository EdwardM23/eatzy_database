import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  editRestaurant,
  getAllRestaurant,
  getAllRestaurantInWishlist,
  getNearestRestaurant,
  getRestaurantById,
} from "../controllers/RestaurantController.js";

const router = express.Router();
router.get("/restaurant/:id", getRestaurantById);
router.post("/restaurant/nearest/:stationId", getNearestRestaurant);
router.post("/restaurant", addRestaurant);
router.patch("/restaurant/:id", editRestaurant);
router.get("/restaurants", getAllRestaurant);
router.get("/wishlist/:token", getAllRestaurantInWishlist);
router.delete("/restaurant/:id", deleteRestaurant);

export default router;
