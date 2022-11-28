import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Wishlist from "../models/WishlistModel.js";

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
        return res.status(404).json({ message: "user not found" });
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
              const token = jwt.sign({ id: dbUser.id }, "secret", {
                expiresIn: "1h",
              });
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
    .catch((err) => {
      console.log("error", err);
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
              .catch((err) => {
                console.log(err);
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
    .catch((err) => {
      console.log("error", err);
    });
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
    console.log(error.message);
  }
};

export const deleteWishlist = async (req, res) => {
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

export const isAuth = async (req, res) => {
  // const authHeader = req.get("Authorization");
  const authHeader = req.params.token;
  console.log(authHeader);
  if (!authHeader) {
    return res.status(401).json({ message: "not authenticated" });
  }
  const token = authHeader.split(" ")[0];
  console.log(token);
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
    console.log(error.message);
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
