require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/", (req, res) => {
  res.send("ISAB API is running");
});

app.listen(port, () => {
  console.log("ISAB API is running");
});
