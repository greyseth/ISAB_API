const pg = require("pg");

const client = new pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD ?? "",
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

module.exports = client;
