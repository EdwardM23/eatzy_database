import StationType from "../models/StationTypeModel.js";
import Station from "../models/StationModel.js";
import { Sequelize } from "sequelize";
import axios from "axios";
import { response } from "express";

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

export const getNearestStation = async (req, res) => {
  // SEARCH STATION
  if (req.body.keyword) {
    const Op = Sequelize.Op;
    try {
      const response = await Station.findAll({
        include: [{ model: StationType }],
        where: { name: { [Op.substring]: req.body.keyword } },
      });
      return res.status(200).json(response);
    } catch (error) {
      return res.status(400).json(error.message);
    }
  }

  // GET NEAREST STATION
  axios.defaults.headers.common["Authorization"] =
    "prj_test_sk_f6c1041c0d4f9b99a04d93ecc7d94cb757620593";
  axios.defaults.headers.common["accept-encoding"] = null;

  try {
    const stationList = await Station.findAll();
    var filteredList = [];
    for (var i = 0; i < stationList.length; i++) {
      // CHECK DISTANCE BY LONG LAT
      const distance1 = await getLongLatDistance(
        req.body.latitude,
        stationList[i].dataValues.location.coordinates[1],
        req.body.longitude,
        stationList[i].dataValues.location.coordinates[0]
      );
      if (distance1 <= 1) {
        const URL =
          "https://api.radar.io/v1/route/distance?origin=" +
          req.body.latitude +
          "," +
          req.body.longitude +
          "&destination=" +
          stationList[i].dataValues.location.coordinates[1] +
          "," +
          stationList[i].dataValues.location.coordinates[0] +
          "&modes=foot&units=metric";
        try {
          await axios.get(URL).then((response) => {
            // console.log("RESPONSE", response.data.routes.foot.distance.value);
            if (response.data.routes.foot.distance.value <= 1000) {
              filteredList.push(stationList[i].dataValues);
            }
          });
        } catch (error) {
          console.log("ERROR", error.message);
        }
      }
    }

    return res.status(200).json(filteredList);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

function getLongLatDistance(lat1, lat2, lon1, lon2) {
  // The math module contains a function
  // named toRadians which converts from
  // degrees to radians.
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;

  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);
  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
}

const getWalkDistance = async (lat1, lat2, lon1, lon2) => {};

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
