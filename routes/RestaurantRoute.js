import express from "express";
import {
  addRestaurant,
  deleteRestaurant,
  editRestaurant,
  getAllRestaurant,
  getAllRestaurantInWishlist,
  getRestaurantById,
} from "../controllers/RestaurantController.js";

const router = express.Router();
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants", addRestaurant);
router.patch("/restaurant/:id", editRestaurant);
router.get("/restaurants", getAllRestaurant);
router.get("/wishlist/:token", getAllRestaurantInWishlist);
router.delete("/restaurant/:id", deleteRestaurant);

export default router;
