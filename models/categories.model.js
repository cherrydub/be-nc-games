const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};
