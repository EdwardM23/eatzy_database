import Restaurant from "../models/RestaurantModel.js";
import path from "path";
import { uploadToCloudinary, uploadDocToCloudinary } from "../Cloudinary.js";

export const getRestaurants = async (req, res) => {
  try {
    const response = await Restaurant.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getRestaurantById = async (req, res) => {
  try {
    const response = await Restaurant.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const addRestaurant = async (req, res) => {
  const allowedTypeImage = [".png", ".jpg", ".jpeg"];
  const allowedTypeDoc = [".pdf"];

  // HANDLE GAMBAR
  const imgFile = req.files.imageFile;
  const imgFileName = imgFile.name;
  const imgFileSize = imgFile.size;
  const imgExt = path.extname(imgFileName);

  if (!allowedTypeImage.includes(imgExt))
    return res.status(422).json({ msg: "Invalid Images" });
  if (imgFileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  try {
    var imgResult = await uploadToCloudinary(
      imgFile.tempFilePath,
      "restaurant"
    );
    var imagePath = imgResult.url;
  } catch (error) {
    res.status(400).json(error.message);
  }

  // HANDLE FILE MENU
  const menuFile = req.files.menuFile;
  const menuFileName = menuFile.name;
  const menuFileSize = menuFile.size;
  const menuExt = path.extname(menuFileName);

  if (!allowedTypeDoc.includes(menuExt))
    return res.status(422).json({ msg: "Invalid Menu File" });
  if (menuFileSize > 5000000)
    return res.status(422).json({ msg: "Menu must be less than 5 MB" });

  try {
    var menuResult = await uploadDocToCloudinary(menuFile.tempFilePath, "menu");
    var menuPath = menuResult.url;
    console.log(menuResult);
  } catch (error) {
    res.status(400).json(error.message);
  }

  console.log(imagePath);
  console.log(menuPath);

  // INSERT DATABASE
  const point = { type: "Point", coordinates: req.body.location };
  try {
    await Restaurant.create({
      name: req.body.name,
      location: point,
      menuURL: menuPath,
      address: req.body.address,
      imageURL: imagePath,
      priceRange: req.body.priceRange,
      schedule: req.body.schedule,
    });
    res.status(201).json({ msg: "New Restaurant has created" });
  } catch (error) {
    console.log(error.message);
  }
};
