const { fetchCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories().then((category) => {
    res.status(200).send({ category });
  });
};
