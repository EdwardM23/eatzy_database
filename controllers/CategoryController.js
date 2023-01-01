import Category from "../models/02CategoryModel.js";

export const addCategory = async (req, res) => {
  if (!req.body.name) {
    res.status(400).json({ msg: "Category name cannot be empty." });
  }

  if (!req.body.isFood) {
    res.status(400).json({ msg: "Category option cannot be empty." });
  }

  var category = await Category.checkName(req.body.name);

  if (category.count > 0) {
    return res.status(400).json({
      msg: "Category " + req.body.name + " is already exist.",
    });
  }

  try {
    await Category.Category(req.body.name, req.body.isFood);
    return res.status(200).json({ msg: "New Food Category has created" });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getFoodCategory = async (req, res) => {
  try {
    const response = await Category.getFoodCategory();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const getCuisineCategory = async (req, res) => {
  try {
    const response = await Category.getCuisineCategory();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const response = await Category.deleteCategory(req.params.id);
    res.status(200).json({ msg: "Category successfully deleted." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const response = await Category.getAllCategories();
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
