import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Wishlist from "../models/WishlistModel.js";
import History from "../models/HistoryModel.js";
import Restaurant from "../models/RestaurantModel.js";
import Category from "../models/CategoryModel.js";
import ForgotPassword from "../models/ForgotPasswordModel.js";

export const loginAdmin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Email and Password cannot be empty." });
  }

  const user = await User.findOne({
    where: {
      email: req.body.email,
    },
  });

  if (!user) return res.status(400).json({ msg: "User not found." });

  if (user.role == "admin") {
    bcrypt.compare(req.body.password, user.password, (err, compareRes) => {
      if (err) {
        // error while comparing
        res
          .status(502)
          .json({ message: "Error while checking user password." });
      } else if (compareRes) {
        // password match
        res.status(200).json({
          message: "User logged in.",
          id: user.id,
          username: user.username,
          email: user.email,
        });
      } else {
        // password doesnt match
        res.status(401).json({ message: "Invalid credentials" });
      }
    });
  } else {
    return res.status(400).json({ msg: "User doesn't has admin role." });
  }
};

export const login = async (req, res) => {
  // checks if email exists
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Email and Password cannot be empty." });
  }

  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(404).json({ message: "User not found." });
      } else {
        // password hash
        bcrypt.compare(
          req.body.password,
          dbUser.password,
          (err, compareRes) => {
            if (err) {
              // error while comparing
              res
                .status(502)
                .json({ message: "error while checking user password" });
            } else if (compareRes) {
              // password match
              const token = jwt.sign({ id: dbUser.id }, "secret", {});
              res.status(200).json({
                message: "user logged in",
                token: token,
                username: dbUser.username,
                email: dbUser.email,
              });
            } else {
              // password doesnt match
              res.status(401).json({ message: "invalid credentials" });
            }
          }
        );
      }
    })
    .catch((error) => {
      return res.status(400).json(error.message);
    });
};

export const register = async (req, res) => {
  // checks if email already exists
  User.findOne({
    where: {
      email: req.body.email,
    },
  })
    .then((dbUser) => {
      if (dbUser) {
        return res.status(409).json({ message: "email already exists" });
      } else if (req.body.email && req.body.password) {
        // password hash
        bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
          if (err) {
            return res
              .status(500)
              .json({ message: "couldnt hash the password" });
          } else if (passwordHash) {
            return User.create({
              email: req.body.email,
              username: req.body.username,
              password: passwordHash,
              role: "user",
            })
              .then(() => {
                res.status(200).json({ message: "user created" });
              })
              .catch((error) => {
                return res.status(400).json(error.message);
                res
                  .status(502)
                  .json({ message: "error while creating the user" });
              });
          }
        });
      } else if (!req.body.password) {
        return res.status(400).json({ message: "password not provided" });
      } else if (!req.body.email) {
        return res.status(400).json({ message: "email not provided" });
      }
    })
    .catch((error) => {
      return res.status(400).json(error.message);
    });
};

export const addWishlist = async (req, res) => {
  var userId = 0;
  try {
    userId = jwt.verify(req.body.token, "secret").id;
  } catch (error) {
    return res.status(400).json({ msg: "Token expired." });
  }
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot add wishlist." });
  }

  const count = await Wishlist.count({
    where: { userId: userId, restaurantId: restaurantId },
  });

  if (count > 0) {
    res.status(403).json({ msg: "Cannot add wishlist." });
  }

  try {
    const response = await Wishlist.create({
      userId: userId,
      restaurantId: restaurantId,
    });
    res.status(200).json({ msg: "Wishlist successfully added." });
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const getUserInfo = async (req, res) => {
  const userId = jwt.verify(req.body.token, "secret").id;
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot add wishlist." });
  }

  try {
    const response = await Wishlist.destroy({
      where: {
        userId: userId,
        restaurantId: restaurantId,
      },
    });
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const deleteWishlist = async (req, res) => {
  console.log("Token:", req.body.token);
  console.log("Restaurant Id:", req.body.restaurantId);
  var userId = 0;
  try {
    userId = jwt.verify(req.body.token, "secret").id;
  } catch (error) {
    return res.status(400).json({ msg: "Token expired." });
  }
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot remove wishlist." });
  }

  try {
    const wishlist = await Wishlist.findOne({
      where: {
        userId: userId,
        restaurantId: restaurantId,
      },
    });

    if (wishlist === null) {
      return res.status(400).json({ msg: "Wishlist not found." });
    }
    await wishlist.destroy();

    res.status(200).json({ msg: "Wishlist successfully removed." });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getCurrentWishlistStatus = async (req, res) => {
  var userId = 0;
  try {
    userId = jwt.verify(req.body.token, "secret").id;
  } catch (error) {
    return res.status(400).json({ msg: "Token expired." });
  }
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot remove wishlist." });
  }

  try {
    const wishlist = await Wishlist.findOne({
      where: {
        userId: userId,
        restaurantId: restaurantId,
      },
    });

    if (wishlist === null) {
      return res.status(200).json(false);
    }

    res.status(200).json(true);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const isAuth = async (req, res) => {
  // const authHeader = req.get("Authorization");
  const authHeader = req.params.token;

  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[0];

  let decodedToken;
  try {
    decodedToken = jwt.verify(token, "secret");
  } catch (err) {
    return res
      .status(500)
      .json({ message: err.message || "could not decode the token" });
  }
  if (!decodedToken) {
    res.status(401).json({ message: "unauthorized" });
  } else {
    res.status(200).json({ message: "here is your resource" });
  }
};

export const getUsers = async (req, res) => {
  try {
    const response = await User.findAll();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const setAsAdmin = async (req, res) => {
  if (req.body.id == 0 || !req.body.id) {
    return res.status(400).json({ msg: "Invalid user ID." });
  }

  const user = await User.findByPk(req.body.id);
  if (!user) {
    return res.status(400).json({ msg: "User not found." });
  }

  try {
    const response = await User.update(
      {
        role: "admin",
      },
      { where: { id: req.body.id } }
    );
    res.status(200).json({ msg: "User successfully registered as admin." });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.id == 0 || !req.body.id) {
    return res.status(400).json({ msg: "Invalid user ID." });
  }

  const user = await User.findByPk(req.body.id);
  if (!user) {
    return res.status(400).json({ msg: "User not found." });
  }

  try {
    const response = await User.destroy({ where: { id: req.body.id } });
    res.status(200).json({ msg: "User successfully deleted." });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const addHistory = async (req, res) => {
  var userId = 0;
  try {
    userId = jwt.verify(req.body.token, "secret").id;
  } catch (error) {
    return res.status(400).json({ msg: "Token expired." });
  }
  const restaurantId = req.body.restaurantId;

  if (!userId || !restaurantId) {
    res.status(400).json({ msg: "Cannot add history." });
  }

  try {
    const history = await History.findOne({
      where: { userId: userId, restaurantId: restaurantId },
    });

    if (history) {
      history.changed("updatedAt", true);
      history.save();
      return res.status(200).json({ msg: "History successfully added." });
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  try {
    const response = await History.create({
      userId: userId,
      restaurantId: restaurantId,
    });
    return res.status(200).json({ msg: "History successfully added." });
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const getLatestHistory = async (req, res) => {
  var userId = 0;
  try {
    userId = jwt.verify(req.params.token, "secret").id;
  } catch (error) {
    return res.status(400).json({ msg: "Token expired." });
  }

  try {
    const response = await History.findAll({
      where: { userId: userId },
      limit: 10,
      attributes: ["updatedAt"],
      include: [
        {
          model: Restaurant,
          include: {
            attributes: ["name"],
            model: Category,
            through: { attributes: [] },
          },
        },
      ],
      order: [["updatedAt", "DESC"]],
    });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};

export const requestForgotPassword = async (req, res) => {
  if (!req.body.email) {
    return res.status(400).json({ msg: "Email cannot be null" });
  }

  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) return res.status(400).json("Email hasn't registered");

    // await ForgotPassword.create({
    //   uuid:
    // })

    return res.status(200).json("Test");
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

function generateUUID(userId) {}
