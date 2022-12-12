import express from "express";
import {
  addCategory,
  deleteCategory,
  getCategoryRestaurant,
  getCuisineCategory,
  getFoodCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/category", addCategory);
router.get("/category/food", getFoodCategory);
router.get("/category/cuisine", getCuisineCategory);
router.delete("/category/:id", deleteCategory);
router.get("/category-detail", getCategoryRestaurant);

export default router;
