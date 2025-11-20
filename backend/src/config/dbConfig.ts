const { Client } = require("pg");
require("dotenv").config();

module.exports.client = new Client({
  user: process.env.user,
  password: process.env.password,
  host: process.env.host,
  port: process.env.dbPort,
  database: process.env.databaseName,
});
