import { Sequelize } from "sequelize";

var db_name = "heroku_ea7df0ec128262c";
var username = "b9592fc9f7570e";
var password = "325757f5";
var host_name = "us-cdbr-east-06.cleardb.net";

// var db_name = "eatzy_db";
// var username = "root";
// var password = "";
// var host_name = "";

const database = new Sequelize(db_name, username, password, {
  host: host_name,
  dialect: "mysql",
});

export default database;
