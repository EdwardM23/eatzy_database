import Restaurant from "../models/RestaurantModel.js";
import path from "path";
import jwt from "jsonwebtoken";
import { uploadToCloudinary, uploadDocToCloudinary } from "../Cloudinary.js";
import RestaurantDetail from "../models/RestaurantDetailModel.js";
import { response } from "express";
import axios from "axios";
import db from "../config/Database.js";
import { QueryTypes } from "sequelize";

import CategoryDetail from "../models/CategoryDetailModel.js";
import Station from "../models/StationModel.js";
import Review from "../models/ReviewModel.js";
import { Sequelize, where } from "sequelize";
import Category from "../models/CategoryModel.js";
import Wishlist from "../models/WishlistModel.js";
import User from "../models/UserModel.js";

export const getRestaurantById = async (req, res) => {
  try {
    const response = await Restaurant.findOne({
      include: {
        model: Category,
        attributes: ["name"],
        through: {
          attributes: [],
        },
      },
      where: { id: req.params.id },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const addRestaurant = async (req, res) => {
  const allowedTypeImage = [".png", ".jpg", ".jpeg"];
  const allowedTypeDoc = [".pdf"];
  var menuPath = "";
  var imagePath = "";

  // HANDLE GAMBAR
  try {
    const imgFile = req.files.imageFile;
    const imgFileName = imgFile.name;
    const imgFileSize = imgFile.size;
    const imgExt = path.extname(imgFileName);

    if (!req.body.longitude || !req.body.latitude) {
      return res.status(400).json({ msg: "Location cannot be empty" });
    }

    if (!allowedTypeImage.includes(imgExt))
      return res.status(422).json({ msg: "Invalid Image" });
    if (imgFileSize > 5000000)
      return res.status(422).json({ msg: "Image must be less than 5 MB" });

    try {
      var imgResult = await uploadToCloudinary(
        imgFile.tempFilePath,
        "restaurant"
      );
      imagePath = imgResult.url;
    } catch (error) {
      res.status(400).json(error.message);
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  // HANDLE FILE MENU
  if (req.files.menuFile) {
    try {
      const menuFile = req.files.menuFile;
      const menuFileName = menuFile.name;
      const menuFileSize = menuFile.size;
      const menuExt = path.extname(menuFileName);

      if (!allowedTypeDoc.includes(menuExt))
        return res.status(422).json({ msg: "Invalid Menu File" });
      if (menuFileSize > 5000000)
        return res.status(422).json({ msg: "Menu must be less than 5 MB" });

      try {
        var menuResult = await uploadDocToCloudinary(
          menuFile.tempFilePath,
          "menu"
        );
        menuPath = menuResult.url;
      } catch (error) {
        return res
          .status(400)
          .json({ msg: error.message, keterangan: "Error upload file menu" });
      }
    } catch (error) {
      return res
        .status(400)
        .json({ msg: error.message, keterangan: "Error insert file menu" });
    }
  }

  // INSERT DATABASE
  const longitude = req.body.longitude;
  const latitude = req.body.latitude;
  const point = { type: "Point", coordinates: [longitude, latitude] };
  var restaurantId = 2;
  var restaurant;
  try {
    await Restaurant.create({
      name: req.body.name,
      location: point,
      menuURL: menuPath,
      address: req.body.address,
      imageURL: imagePath,
      priceRange: req.body.priceRange,
      schedule: req.body.schedule,
    }).then((response) => {
      restaurantId = response.dataValues.id;
      restaurant = response;
    });
  } catch (error) {
    return res.status(400).json(error.message);
  }

  // ADD RESTAURANT CATEGORIES

  if (!Array.isArray(req.body.categoryId)) {
    try {
      await CategoryDetail.create({
        categoryId: req.body.categoryId,
        restaurantId: restaurantId,
      });
    } catch (error) {
      await restaurant.destroy();
      return res.status(400).json({
        err: error.message,
        msg: "Cannot find category with ID " + req.body.categoryId,
      });
    }
  } else {
    for (var i = 0; i < req.body.categoryId.length; i++) {
      try {
        await CategoryDetail.create({
          categoryId: req.body.categoryId[i],
          restaurantId: restaurantId,
        });
      } catch (error) {
        await restaurant.destroy();
        return res.status(400).json({
          err: error.message,
          msg: "Cannot find category with ID " + req.body.categoryId[i],
        });
      }
    }
  }

  // ADD NEAREST STATION
  axios.defaults.headers.common["Authorization"] =
    "prj_test_sk_f6c1041c0d4f9b99a04d93ecc7d94cb757620593";
  axios.defaults.headers.common["accept-encoding"] = null;

  try {
    const stationList = await Station.findAll();
    for (var i = 0; i < stationList.length; i++) {
      // CHECK DISTANCE BY LONG LAT
      const distance1 = getLongLatDistance(
        req.body.latitude,
        stationList[i].dataValues.location.coordinates[1],
        req.body.longitude,
        stationList[i].dataValues.location.coordinates[0]
      );
      if (distance1 <= 4.1) {
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
            if (response.data.routes.foot.distance.value <= 4100) {
              try {
                RestaurantDetail.create({
                  restaurantId: restaurantId,
                  stationId: stationList[i].dataValues.id,
                  walkDistance: response.data.routes.foot.distance.value,
                });
              } catch (error) {
                return res.status(400).json({ msg: error.message });
              }
            }
          });
        } catch (error) {
          return res.status(400).json({ msg: error.message });
        }
      }
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  res.status(200).json({ msg: "New Restaurant has created" });
};

export const getNearestRestaurant = async (req, res) => {
  const Op = Sequelize.Op;
  var resCond = "";

  if (!req.params.stationId) {
    return res.status(400).json({ msg: "Station id cannot be empty." });
  }

  try {
    var restaurantList = [];
    var filterRestId = [];
    if (req.body.categories) {
      if (req.body.categories.length) {
        resCond =
          "WHERE `category_detail`.`categoryId` IN (" +
          req.body.categories +
          ")";
      }
      restaurantList = await db.query(
        "SELECT `restaurantId` FROM `category_detail` " +
          resCond +
          " GROUP BY `restaurantId`",
        {
          type: QueryTypes.SELECT,
        }
      );

      for (var i = 0; i < restaurantList.length; i++) {
        filterRestId.push(restaurantList[i].restaurantId);
      }
    } else {
      restaurantList = await db.query("SELECT `id` FROM `restaurant`", {
        type: QueryTypes.SELECT,
      });

      for (var i = 0; i < restaurantList.length; i++) {
        filterRestId.push(restaurantList[i].id);
      }
    }

    const response = await Station.findAll({
      include: {
        // subQuery: false,
        model: Restaurant,
        include: [
          {
            model: Category,
            attributes: ["name"],
            through: {
              attributes: [],
            },
          },
        ],
        through: {
          attributes: ["walkDistance"],
        },
        where: { id: filterRestId },
      },
      order: [
        [
          Sequelize.literal("`restaurants->restaurant_detail`.`walkDistance`"),
          "ASC",
        ],
      ],
      where: { id: req.params.stationId },
    });

    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const editRestaurant = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Restaurant id is empty." });
  }

  const restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant === null)
    return res.status(400).json({ msg: "Restaurant not found." });

  try {
    if (req.body.name) restaurant.name = req.body.name;
    if (req.body.address) restaurant.address = req.body.address;
    if (req.body.priceRange) restaurant.priceRange = req.body.priceRange;
    if (req.body.schedule) restaurant.schedule = req.body.schedule;

    restaurant.save();
    res.status(200).json({ msg: "Restaurant successfully edited." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const editRestaurantImage = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Restaurant id is empty." });
  }

  const restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant === null)
    return res.status(400).json({ msg: "Restaurant not found." });

  const allowedTypeImage = [".png", ".jpg", ".jpeg"];
  var imagePath = "";

  try {
    if (req.files.imageFile) {
      try {
        const imgFile = req.files.imageFile;
        const imgFileName = imgFile.name;
        const imgFileSize = imgFile.size;
        const imgExt = path.extname(imgFileName);

        if (!allowedTypeImage.includes(imgExt))
          return res.status(422).json({ msg: "Invalid Image" });
        if (imgFileSize > 5000000)
          return res.status(422).json({ msg: "Image must be less than 5 MB" });

        try {
          var imgResult = await uploadToCloudinary(
            imgFile.tempFilePath,
            "restaurant"
          );
          imagePath = imgResult.url;
        } catch (error) {
          res.status(400).json(error.message);
        }
      } catch (error) {
        return res.status(400).json(error.message);
      }

      if (imagePath) restaurant.imageURL = imagePath;

      restaurant.save();
      res.status(200).json({ msg: "Restaurant image successfully edited." });
    }
  } catch (error) {
    res.status(400).json("Image file not found.");
  }
};

export const editRestaurantMenu = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Restaurant id is empty." });
  }

  const restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant === null)
    return res.status(400).json({ msg: "Restaurant not found." });

  const allowedTypeDoc = [".pdf"];
  var menuPath = "";

  try {
    if (req.files.menuFile) {
      try {
        const menuFile = req.files.menuFile;
        const menuFileName = menuFile.name;
        const menuFileSize = menuFile.size;
        const menuExt = path.extname(menuFileName);

        if (!allowedTypeDoc.includes(menuExt))
          return res.status(422).json({ msg: "Invalid Menu File" });
        if (menuFileSize > 5000000)
          return res.status(422).json({ msg: "Menu must be less than 5 MB" });

        try {
          var menuResult = await uploadDocToCloudinary(
            menuFile.tempFilePath,
            "menu"
          );
          menuPath = menuResult.url;
        } catch (error) {
          return res
            .status(400)
            .json({ msg: error.message, keterangan: "Error upload file menu" });
        }

        if (menuPath) restaurant.menuURL = menuPath;

        restaurant.save();
        res.status(200).json({ msg: "Restaurant menu successfully edited." });
      } catch (error) {
        return res
          .status(400)
          .json({ msg: error.message, keterangan: "Error insert file menu" });
      }
    }
  } catch (error) {
    res.status(400).json("Menu file not found.");
  }
};

export const getAllRestaurant = async (req, res) => {
  try {
    const response = await Restaurant.findAll();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAllRestaurantInWishlist = async (req, res) => {
  const userId = jwt.verify(req.params.token, "secret").id;

  try {
    const response = await User.findAll({
      attributes: [],
      include: [
        {
          model: Restaurant,
          include: {
            attributes: ["name"],
            model: Category,
            through: { attributes: [] },
          },
          through: { attributes: [] },
        },
      ],
      where: {
        id: userId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteRestaurant = async (req, res) => {
  try {
    const response = await Restaurant.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json({ msg: "Restaurant successfully deleted." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const deleteRestaurantMenu = async (req, res) => {
  if (!req.params.id) {
    return res.status(400).json({ msg: "Restaurant id is empty." });
  }

  const restaurant = await Restaurant.findByPk(req.params.id);
  if (restaurant === null)
    return res.status(400).json({ msg: "Restaurant not found." });

  try {
    restaurant.menuURL = "";
    restaurant.save();
    res.status(200).json({ msg: "Restaurant menu successfully deleted." });
  } catch (error) {
    res.status(400).json(error.message);
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
