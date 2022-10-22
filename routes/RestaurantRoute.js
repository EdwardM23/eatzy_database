import express from "express";
import {
  addRestaurant,
  getRestaurantById,
  getRestaurants,
} from "../controllers/RestaurantController.js";

const router = express.Router();
router.get("/restaurants", getRestaurants);
router.get("/restaurants/:id", getRestaurantById);
router.post("/restaurants", addRestaurant);

export default router;
