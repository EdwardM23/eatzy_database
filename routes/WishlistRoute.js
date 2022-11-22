import express from "express";

import {
  addWishlist,
  getWishlist,
  removeWishlist,
} from "../controllers/WishlistController.js";

const router = express.Router();

router.get("/wishlist/:token", getWishlist);
router.post("/wishlist", addWishlist);
// router.delete("/wishlist", removeWishlisthlist);

export default router;
