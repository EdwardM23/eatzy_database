import StationType from "../models/01StationTypeModel.js";
import path from "path";
import { uploadToCloudinary } from "../Cloudinary.js";

export const addStationType = async (req, res) => {
  if (!req.body.name)
    return res.status(400).json({
      msg: "Station Type name cannot be null.",
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
  } catch (error) {
    return res.status(400).json(error.message);
  }

  try {
    await StationType.StationType(req.body.name, imagePath);
    res.status(201).json({ msg: "New Station Type has created" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const deleteStationType = async (req, res) => {
  if (!req.params.id)
    return res.status(400).json({
      msg: "Station Type id cannot be null.",
    });

  const sc = await StationType.checkStationType(req.params.id);
  console.log(sc);
  if (!sc) {
    return res.status(400).json({ msg: `Station Type not found` });
  }

  try {
    await StationType.deleteStationType(req.params.id);
    res.status(201).json({ msg: "Station Type has deleted" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getAllStationType = async (req, res) => {
  try {
    const response = await StationType.getAllStationType();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};
