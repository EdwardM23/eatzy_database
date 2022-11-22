import User from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const userLogin = async (req, res) => {
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
              res.status(200).json({ message: "user logged in", token: token });
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

export const userRegister = async (req, res) => {
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
