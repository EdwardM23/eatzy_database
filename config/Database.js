import { Sequelize } from "sequelize";

// var db_name = "heroku_cf5c5ad343017c2";
// var username = "b45d8558fabf0b";
// var password = "0e87aeac";
// var host_name = "us-cdbr-east-06.cleardb.net";

var db_name = "eatzy_db";
var username = "root";
var password = "";
var host_name = "";

const database = new Sequelize(db_name, username, password, {
  host: host_name,
  dialect: "mysql",
});

export default database;
