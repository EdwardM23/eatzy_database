import { Sequelize } from "sequelize";

var db_name = "eatzy_kw";
var username = "root";
var password = "";

const database = new Sequelize(db_name, username, password, {
  host: "localhost",
  dialect: "mysql",
});

export default database;
