import express from "express";
import cors from "cors";
import fileUpload from "express-fileupload";

import db from "./config/Database.js";
import UserRoute from "./routes/UserRoute.js";
import RestaurantRoute from "./routes/RestaurantRoute.js";
import StationCategoryRoute from "./routes/StationCategoryRoute.js";
import StationRoute from "./routes/StationRoute.js";
import { Sequelize } from "sequelize";

const app = express();
app.use(cors());
app.use(express.json());
app.use(fileUpload());
app.use(express.static("public"));

app.use(StationCategoryRoute);
app.use(UserRoute);
app.use(RestaurantRoute);
app.use(StationRoute);

(async () => {
  await db.sync({ alter: true });
})();

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is running in port " + PORT);
});

export default app;
