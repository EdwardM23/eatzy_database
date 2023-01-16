import StationType from "../models/StationTypeModel.js";
import Station from "../models/StationModel.js";
import { Sequelize } from "sequelize";
import axios from "axios";
import { response } from "express";
import Restaurant from "../models/RestaurantModel.js";
import RestaurantDetail from "../models/RestaurantDetailModel.js";

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
    const station = await Station.create({
      name: req.body.name,
      location: point,
      stationTypeId: req.body.station_type_id,
    });

    axios.defaults.headers.common["Authorization"] =
      "prj_test_sk_f6c1041c0d4f9b99a04d93ecc7d94cb757620593";
    axios.defaults.headers.common["accept-encoding"] = null;
    try {
      const restaurantList = await Restaurant.findAll();
      for (var i = 0; i < restaurantList.length; i++) {
        // CHECK DISTANCE BY LONG LAT
        const distance1 = getLongLatDistance(
          req.body.latitude,
          restaurantList[i].dataValues.location.coordinates[1],
          req.body.longitude,
          restaurantList[i].dataValues.location.coordinates[0]
        );
        if (distance1 <= 4.1) {
          const URL =
            "https://api.radar.io/v1/route/distance?origin=" +
            req.body.latitude +
            "," +
            req.body.longitude +
            "&destination=" +
            restaurantList[i].dataValues.location.coordinates[1] +
            "," +
            restaurantList[i].dataValues.location.coordinates[0] +
            "&modes=foot&units=metric";
          try {
            await axios.get(URL).then((response) => {
              if (response.data.routes.foot.distance.value <= 4100) {
                try {
                  RestaurantDetail.create({
                    restaurantId: restaurantList[i].dataValues.id,
                    stationId: station.id,
                    walkDistance: response.data.routes.foot.distance.value,
                  });
                } catch (error) {
                  return res.status(400).json(error.message);
                }
              }
            });
          } catch (error) {
            return res.status(400).json(error.message);
          }
        }
      }
    } catch (error) {
      return res.status(400).json(error.message);
    }
    res.status(201).json({ msg: "New Station has created" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getNearestStation = async (req, res) => {
  // SEARCH STATION
  const Op = Sequelize.Op;
  if (req.body.keyword) {
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
    const stationList = await Station.findAll({
      include: [{ model: StationType }],
      where: { name: { [Op.substring]: req.body.keyword } },
    });
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
            if (response.data.routes.foot.distance.value <= 1000) {
              filteredList.push(stationList[i].dataValues);
            }
          });
        } catch (error) {
          return res.status(400).json(error.message);
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

export const editStation = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Station id is empty." });
  }

  const station = await Station.findByPk(req.params.id);
  if (station === null)
    return res.status(400).json({ msg: "Station not found." });

  try {
    if (req.body.name) station.name = req.body.name;
    if (req.body.station_type_id)
      station.stationTypeId = req.body.station_type_id;

    station.save();
    res.status(200).json({ msg: "Station successfully edited." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getStationById = async (req, res) => {
  try {
    const response = await Station.findByPk(req.params.id);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteStation = async (req, res) => {
  const station = await Station.findByPk(req.params.id);
  if (station === null)
    return res.status(400).json({ msg: "Station not found." });

  try {
    const response = await Station.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Station successfully deleted." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

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
