const pg = require("pg");

const client = pg.Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  password: process.env.DB_PASSWORD ?? "",
  port: process.env.DB_PORT,
});

module.exports = client;
