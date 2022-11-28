import StationType from "../models/StationTypeModel.js";
import Station from "../models/StationModel.js";
import { Sequelize } from "sequelize";

export const addStation = async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({
      msg: "Station name cannot be null.",
    });
  if (!req.body.longitude || !req.body.latitude) {
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

  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  const point = { type: "Point", coordinates: [longitude, latitude] };
  try {
    await Station.create({
      name: req.body.name,
      location: point,
      stationTypeId: req.body.station_type_id,
    });
    res.status(201).json({ msg: "New Station has created" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getNearestStation = async (req, res) => {};

export const searchStation = async (req, res) => {
  const Op = Sequelize.Op;
  try {
    const response = await Station.findAll({
      include: [{ model: StationType }],
      where: { name: { [Op.substring]: req.params.keyword } },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const editStation = async (req, res) => {};

export const getStationById = async (req, res) => {};

export const deleteStation = async (req, res) => {};

export const getAllStation = async (req, res) => {
  try {
    const response = await Station.findAll({
      include: [{ model: StationType }],
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
