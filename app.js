const express = require("express");
const app = express();
const { getCategories } = require("./controllers/categories.controller");

app.get("/api/categories", getCategories);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "Path not found!" });
});

module.exports = app;
