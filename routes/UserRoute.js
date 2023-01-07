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
  requestForgotPassword,
  getCurrentWishlistStatus,
  loginAdmin,
  deactivateUser,
} from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/login/admin", loginAdmin);
router.patch("/admin", setAsAdmin);
router.delete("/user", deleteUser);

router.post("/wishlist", addWishlist);
router.delete("/wishlist", deleteWishlist);
router.post("/wishlist/status", getCurrentWishlistStatus);

router.post("/history", addHistory);
router.get("/history/:token", getLatestHistory);

router.get("/auth/:token", isAuth);
router.get("/user", getUsers);
router.patch("/user/deactivate/:id", deactivateUser);

router.post("/forgot-password", requestForgotPassword);
// router.get("/users/:id", getUserById);

export default router;
