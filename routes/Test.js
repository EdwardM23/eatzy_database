import express from "express";
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    res.json({
      status: 200,
      message: "Nice!",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Server error.");
  }
});

export default router;
