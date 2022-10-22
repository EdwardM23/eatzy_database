import Restaurant from "../models/RestaurantModel.js";
import path from "path";

export const getRestaurants = async (req, res) => {
  try {
    const response = await Restaurant.findAll();
    // res.status(200).json(response);
    res.json({
      status: 200,
      message: "Success",
    });
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
  if (req.files === null)
    return res.status(400).json({ msg: "No file uploaded." });

  const name = req.body.name;
  const latitude = req.body.latitude;
  const longitude = req.body.longitude;
  const address = req.body.address;
  const openTime = req.body.openTime;
  const closeTime = req.body.closeTime;

  const image = req.files;
  const imageSize = files.data.length;
  const imageExt = path.extname(image.name);
  const imageName = image.md5 + imageExt;
  const url = `${req.protocol}://${req.get("host")}/images/${imageName}`;
  const imageAllowedType = [".png", ".jpg", "jpeg"];

  if (!imageAllowedType.includes(imageExt.toLowerCase()))
    return res.status(422).json({ msg: "Image invalid." });

  if (imageSize > 5000000)
    return res.status(422).json({ msg: "Image must be less than 5 MB." });

  image.mv(`./public/images/${filename}`, async (err) => {
    if (err) return res.status(500).json({ msg: err.message });
    try {
      await Restaurant.create({
        name: name,
        latitude: latitude,
        longitude: longitude,
        address: address,
        openTime: openTime,
        closeTime: closeTime,
        image: image,
        imageURL: url,
      });
      res.status(201).json({ msg: "Restaurant added successfully." });
    } catch (error) {
      console.log(error.message);
    }
  });
};
