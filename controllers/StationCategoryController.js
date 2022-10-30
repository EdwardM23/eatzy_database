import StationCategory from "../models/StationCategoryModel.js";

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

  try {
    await StationCategory.create(req.body);
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

  let sc = StationCategory.findOne({ where: { id: req.params.id } });
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
