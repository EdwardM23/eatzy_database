import express from "express";
import cors from "cors";
import UserRoute from "./routes/UserRoute.js";
import RestaurantRoute from "./routes/RestaurantRoute.js";
const product = require("./routes/Test.js");

const app = express();
app.use(cors());
app.use(express.json());
app.use(UserRoute);
app.use(RestaurantRoute);
app.use("/api/product", product);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log("Server is running in port " + PORT);
});
