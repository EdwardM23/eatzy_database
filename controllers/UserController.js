import User from "../models/UserModel.js";
// const bcrpyt = require("bcrypt");

export const userLogin = async (req, res) => {
  const hash = bcrpyt.hashSync(req.body.password, 10);
  var username = req.body.username;
  var password = req.body.password;

  if (!username || !password) {
    res.status(400).json({ msg: "Username and Password must be filled." });
  }

  try {
    var user = await User.authentica;

    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const userRegister = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const getUserById = async (req, res) => {
  try {
    const response = await User.findOne({
      where: {
        id: req.params.id,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    console.log(error.message);
  }
};

export const createUser = async (req, res) => {
  try {
    await User.create(req.body);
    res.status(201).json({ msg: "New User has created" });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateUser = async (req, res) => {
  try {
    await User.update(req.body, {
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ msg: "User has updated" });
  } catch (error) {
    console.log(error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.destroy({
      where: {
        id: req.params.id,
      },
    });
    res.status(201).json({ msg: "User has deleted" });
  } catch (error) {
    console.log(error.message);
  }
};
