const { fetchCategories } = require("../models/categories.model");

exports.getCategories = (req, res, next) => {
  fetchCategories()
    .then((data) => {
      res.status(200).send(data.rows);
    })
    .catch(next);
};
