import StationCategory from "../models/StationCategoryModel.js";
import path from "path";
import { uploadToCloudinary } from "../Cloudinary.js";

export const getStationCategories = async (req, res) => {
  try {
    const response = await StationCategory.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const addStationCategory = async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({
      msg: "Station Category name cannot be null.",
    });

  if (req.files === null)
    return res.status(400).json({ msg: "No File Uploaded" });

  const file = req.files.file;
  const fileName = file.name;
  const fileSize = file.size;
  const ext = path.extname(fileName);
  const allowedType = [".png", ".jpg", ".jpeg"];
  var imagePath = "";

  if (!allowedType.includes(ext.toLowerCase()))
    return res.status(422).json({ msg: "Invalid Images" });
  if (fileSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB" });

  try {
    var locaFilePath = file.tempFilePath;
    var result = await uploadToCloudinary(locaFilePath, "station-category");
    imagePath = result.url;
    console.log(result);
  } catch (error) {
    res.status(400).json(error.message);
  }

  try {
    await StationCategory.create({
      name: req.body.name,
      image: imagePath,
    });
    res.status(201).json({ msg: "New Station Category has created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteStationCategory = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      msg: "Station Category id cannot be null.",
    });

  let sc = StationCategory.findByPk(req.params.id);
  if (!sc) {
    return res
      .status(404)
      .json({ msg: `Station Category with id ${id} was not found` });
  }

  try {
    await StationCategory.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ msg: "Station Category has deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
