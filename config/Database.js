import { Sequelize } from "sequelize";

var db_name = "heroku_ea7df0ec128262c";
var username = "b9592fc9f7570e";
var password = "325757f5";
var host_name = "http://us-cdbr-east-06.cleardb.net";

const database = new Sequelize(db_name, username, password, {
  host: host_name,
  dialect: "mysql",
});

export default database;
