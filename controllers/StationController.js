import StationCategory from "../models/StationCategoryModel.js";
import Station from "../models/StationModel.js";

export const getStations = async (req, res) => {
  try {
    const response = await Station.findAll({
      include: [{ model: StationCategory }],
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const addStation = async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({
      msg: "Station name cannot be null.",
    });
  if (!req.body.location) {
    return res.status(400).json({
      msg: "Station location cannot be null.",
    });
  }
  var stationCat = StationCategory.findByPk(req.body.stationCategoryId);
  if (stationCat === null) {
    return res.status(404).json({
      msg: `Station Category with id ${req.body.categoryId} was not found`,
    });
  }
  try {
    const point = { type: "Point", coordinates: req.body.location };
    await Station.create({
      name: req.body.name,
      location: point,
      station_category_id: req.body.station_category_id,
    });
    res.status(201).json({ msg: "New Station has created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const getStationById = async (req, res) => {};

export const deleteStation = async (req, res) => {};
