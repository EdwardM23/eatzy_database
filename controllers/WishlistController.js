import jwt from "jsonwebtoken";
import Wishlist from "../models/WishlistModel.js";

export const getWishlist = async (req, res) => {
  const userId = jwt.verify(req.params.token, "secret").id;

  try {
    const response = await Wishlist.findAll({
      where: {
        userId: userId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
  }
};

export const addWishlist = async (req, res) => {
  const userId = jwt.verify(req.body.token, "secret").id;
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot add wishlist." });
  }

  const count = await Wishlist.count({
    where: { userId: userId, restaurantId: restaurantId },
  });

  if (count > 0) {
    res.status(400).json({ msg: "Cannot add wishlist." });
  }

  try {
    const response = await Wishlist.create({
      userId: userId,
      restaurantId: restaurantId,
    });
    res.status(200).json({ msg: "Wishlist successfully added." });
  } catch (error) {
    console.log(error);
  }
};

export const removeWishlist = async (req, res) => {
  const userId = jwt.verify(req.body.token, "secret").id;
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot remove wishlist." });
  }

  const count = await Wishlist.count({
    where: { userId: userId, restaurantId: restaurantId },
  });

  if (count == 0) {
    res.status(400).json({ msg: "Cannot remove wishlist." });
  }

  try {
    const response = await Wishlist.destroy({
      where: {
        userId: userId,
        restaurantId: restaurantId,
      },
    });
    res.status(200).json({ msg: "Wishlist successfully removed." });
  } catch (error) {
    console.log(error);
  }
};
