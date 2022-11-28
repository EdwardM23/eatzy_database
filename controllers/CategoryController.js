import Category from "../models/CategoryModel.js";

export const addCategory = async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ msg: "Category name cannot be empty." });
  }

  if (!req.body.isFood) {
    res.status(400).json({ msg: "Category option cannot be empty." });
  }

  var category = await Category.findAndCountAll({
    where: { name: req.body.name },
  });
  // console.log(category.count);
  if (category.count > 0) {
    return res.status(400).json({
      msg: "Category " + req.body.name + " is already exist.",
    });
  }

  try {
    await Category.create({
      name: req.body.name,
      isFood: req.body.isFood,
    });
    res.status(200).json({ msg: "New Food Category has created" });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getFoodCategory = async (req, res) => {
  try {
    const response = await Category.findAll({
      where: {
        isFood: true,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCuisineCategory = async (req, res) => {
  try {
    const response = await Category.findAll({
      where: {
        isFood: false,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};
