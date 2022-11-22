import express from "express";
import {
  getStationTypes,
  addStationType,
  deleteStationType,
} from "../controllers/StationTypeController.js";

const router = express.Router();
router.get("/station-type", getStationTypes);
router.post("/station-type", addStationType);
router.delete("/station-type/:id", deleteStationType);

export default router;
