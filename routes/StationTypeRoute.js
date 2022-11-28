import express from "express";
import {
  addStationType,
  deleteStationType,
  getAllStationType,
} from "../controllers/StationTypeController.js";

const router = express.Router();
router.post("/station-type", addStationType);
router.delete("/station-type/:id", deleteStationType);
router.get("/station-type", getAllStationType);

export default router;
