const db = require("../db/connection");
const format = require("pg-format");

exports.fetchCategories = () => {
  return db.query("SELECT * FROM categories").then((categories) => {
    return categories.rows;
  });
};

// exports.fetchReviewsById = (review_id) => {
//   // console.log("inside models", review_id);
//   return db
//     .query(
//       `
//     SELECT * FROM reviews
//     WHERE review_id = $1;
//     `,
//       [review_id]
//     )
//     .then((reviews) => {
//       return reviews.rows[0];
//     });
// };
