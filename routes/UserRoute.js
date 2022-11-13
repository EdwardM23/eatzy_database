import express from "express";
import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
  userLogin,
  userRegister,
} from "../controllers/UserController.js";

const router = express.Router();
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.patch("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

router.post("/login", userLogin);
// router.get("/register", userRegister);
// router.

export default router;
