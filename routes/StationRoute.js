import express from "express";
import { addStation, getStations } from "../controllers/StationController.js";

const router = express.Router();
router.get("/station", getStations);
router.post("/station", addStation);

export default router;
