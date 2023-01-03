import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const ForgotPassword = db.define(
  "forgot_password",
  { uuid: DataTypes.STRING },
  {
    freezeTableName: true,
  }
);

export default ForgotPassword;
