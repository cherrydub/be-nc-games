const db = require("../db/connection");

exports.fetchReviewsById = (id) => {
  return db
    .query(
      `
      SELECT * FROM reviews
      WHERE review_id = $1
      `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "404 ID not found" });
      }
      return rows[0];
    });
};
