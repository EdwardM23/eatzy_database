import express from "express";
import {
  addStation,
  getStations,
  searchStation,
} from "../controllers/StationController.js";

const router = express.Router();
router.get("/station", getStations);
router.post("/station", addStation);
router.get("/station/:keyword", searchStation);

export default router;
