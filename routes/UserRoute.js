import express from "express";
import {
  getUsers,
  register,
  isAuth,
  addWishlist,
  login,
  setAsAdmin,
  deleteWishlist,
  deleteUser,
  addHistory,
  getLatestHistory,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.patch("/admin", setAsAdmin);
router.delete("/user", deleteUser);

router.post("/wishlist", addWishlist);
router.delete("/wishlist", deleteWishlist);

router.post("/history", addHistory);
router.get("/history/:token", getLatestHistory);

router.get("/auth/:token", isAuth);

router.get("/user", getUsers);
// router.get("/users/:id", getUserById);

// NANTI DELETE

export default router;
