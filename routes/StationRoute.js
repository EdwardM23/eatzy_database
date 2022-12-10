import express from "express";
import {
  addStation,
  deleteStation,
  editStation,
  getAllStation,
  getNearestStation,
  getStationById,
} from "../controllers/StationController.js";

const router = express.Router();
router.post("/station", addStation);
router.post("/station/:id", getStationById);
router.post("/station/nearest", getNearestStation);
router.patch("/station/:id", editStation);
router.delete("/station/:id", deleteStation);
router.get("/station", getAllStation);

export default router;
