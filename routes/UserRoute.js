import express from "express";
import {
  getUsers,
  userLogin,
  userRegister,
  isAuth,
} from "../controllers/UserController.js";

const router = express.Router();
router.get("/user", getUsers);
// router.get("/users/:id", getUserById);
// router.post("/users", createUser);
// router.patch("/users/:id", updateUser);
// router.delete("/users/:id", deleteUser);

router.post("/login", userLogin);
router.post("/register", userRegister);
router.get("/auth/:token", isAuth);

export default router;
