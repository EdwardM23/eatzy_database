import express from "express";
import {
  getStationCategories,
  addStationCategory,
  deleteStationCategory,
} from "../controllers/StationCategoryController.js";

const router = express.Router();
router.get("/station-category", getStationCategories);
router.post("/station-category", addStationCategory);
router.delete("/station-category/:id", deleteStationCategory);

export default router;
