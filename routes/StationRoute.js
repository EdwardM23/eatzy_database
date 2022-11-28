import express from "express";
import {
  addStation,
  deleteStation,
  editStation,
  getAllStation,
  getNearestStation,
  searchStation,
} from "../controllers/StationController.js";

const router = express.Router();
router.post("/station", addStation);
router.get("/station/nearest", getNearestStation);
router.get("/station/:keyword", searchStation);
router.patch("/station/:id", editStation);
router.delete("/station/:id", deleteStation);
router.get("/station", getAllStation);

export default router;
