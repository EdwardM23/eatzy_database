import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";
import { v2 as cloudinary } from "cloudinary";

import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import RestaurantRoute from "./routes/RestaurantRoute.js";
import StationTypeRoute from "./routes/StationTypeRoute.js";
import StationRoute from "./routes/StationRoute.js";
import ReviewRoute from "./routes/ReviewRoute.js";
import CategoryRoute from "./routes/CategoryRoute.js";

const app = express();
app.use(cors());
app.use(express.json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);
// app.use(express.static("public"));

app.use(UserRoute);
app.use(StationTypeRoute);
app.use(RestaurantRoute);
app.use(StationRoute);
app.use(ReviewRoute);
app.use(CategoryRoute);

(async () => {
  await db.sync({ alter: true, force: false });
})();

cloudinary.config({
  cloud_name: "dj4qeraf0",
  api_key: "473929345181735",
  api_secret: "A-HSBCxeNEulFa-SiCYs4DUBqmg",
});

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is running in port " + PORT);
});

export default app;
