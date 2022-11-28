import express from "express";
import {
  addCategory,
  getCuisineCategory,
  getFoodCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();

router.post("/category", addCategory);
router.get("/category/food", getFoodCategory);
router.get("/category/cuisine", getCuisineCategory);

export default router;
