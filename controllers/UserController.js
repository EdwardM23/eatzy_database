import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Wishlist from "../models/WishlistModel.js";
import History from "../models/HistoryModel.js";

export const loginAdmin = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res
      .status(400)
      .json({ message: "Email and Password cannot be empty." });
  }

  const user = await User.checkUserByEmail(req.body.email);

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

  User.checkUserByEmail(req.body.email)
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
  if (!req.body.password) {
    return res.status(400).json({ message: "Please insert password." });
  } else if (!req.body.email) {
    return res.status(400).json({ message: "Please insert email." });
  }

  const user = await User.checkUserByEmail(req.body.email);
  if (user)
    return res.status(400).json({ message: "Email already registered." });

  if (req.body.email && req.body.password) {
    // password hash
    bcrypt.hash(req.body.password, 12, (err, passwordHash) => {
      if (err) {
        return res.status(500).json({ message: "Couldn't hash password" });
      } else if (passwordHash) {
        try {
          User.User(req.body.email, req.body.username, passwordHash, "user");

          res.status(200).json({ message: "User created." });
        } catch (error) {
          res.status(502).json({ message: "Error while creating the user." });
        }
      }
    });
  }
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

  const wishlist = await Wishlist.checkWishlist(userId, restaurantId);

  if (wishlist) {
    res.status(403).json({ msg: "Cannot add wishlist." });
  }

  try {
    const response = await Wishlist.Wishlist(userId, restaurantId);
    res.status(200).json({ msg: "Wishlist successfully added." });
  } catch (error) {
    res.status(400).json(error.message);
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
    const wishlist = await Wishlist.checkWishlist(userId, restaurantId);

    if (wishlist === null) {
      return res.status(400).json({ msg: "Wishlist not found." });
    }
    await Wishlist.deleteWishlist(wishlist);

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
    const wishlist = await Wishlist.checkWishlist(userId, restaurantId);

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
    const response = await User.getAllUser();
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json(error.message);
  }
};

export const setAsAdmin = async (req, res) => {
  if (req.body.id == 0 || !req.body.id) {
    return res.status(400).json({ msg: "Invalid user ID." });
  }

  const user = await User.checkUser(req.body.id);
  if (!user) {
    return res.status(400).json({ msg: "User not found." });
  }

  try {
    await User.setAsAdmin(req.body.id);
    res.status(200).json({ msg: "User successfully registered as admin." });
  } catch (error) {
    res.status(400).json(error);
  }
};

export const deleteUser = async (req, res) => {
  if (req.body.id == 0 || !req.body.id) {
    return res.status(400).json({ msg: "Invalid user ID." });
  }

  const user = await User.checkUser(req.body.id);
  if (!user) {
    return res.status(400).json({ msg: "User not found." });
  }

  try {
    await User.deleteUser(req.body.id);
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
    const history = await History.checkHistory(userId, restaurantId);

    if (history) {
      History.update(history);
      return res.status(200).json({ msg: "History successfully added." });
    }
  } catch (error) {
    return res.status(400).json(error.message);
  }

  try {
    const response = await History.History(userId, restaurantId);
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
  console.log("USER ID:", userId);
  try {
    const response = await History.getLatestHistory(userId);
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json(error.message);
  }
};
