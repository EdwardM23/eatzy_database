import StationType from "../models/StationTypeModel.js";
import Station from "../models/StationModel.js";
import { Sequelize } from "sequelize";

export const getStations = async (req, res) => {
  try {
    const response = await Station.findAll({
      include: [{ model: StationType }],
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
  var stationType = StationType.findByPk(req.body.station_type_id);
  if (stationType === null) {
    return res.status(404).json({
      msg: `Station Type with id ${req.body.station_type_id} was not found`,
    });
  }
  try {
    var point = { type: "Point", coordinates: req.body.location };
    console.log("????//?//?");
    console.log(point);
    await Station.create({
      name: req.body.name,
      location: { type: "Point", coordinates: req.body.location },
      stationTypeId: req.body.station_type_id,
    });
    res.status(201).json({ msg: "New Station has created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const searchStation = async (req, res) => {
  const Op = Sequelize.Op;
  console.log("======");
  console.log("KEYWORD: " + req.params.keyword);
  try {
    const response = await Station.findAll({
      include: [{ model: StationType }],
      where: { name: { [Op.substring]: req.params.keyword } },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getStationById = async (req, res) => {};

export const deleteStation = async (req, res) => {};
