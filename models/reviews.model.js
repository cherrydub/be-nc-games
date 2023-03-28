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

exports.fetchReviews = () => {
  const queryOne = `
  SELECT * FROM reviews;
  `;

  const queryThree = `

  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;
`;
  return db.query(queryThree).then(({ rows }) => {
    return rows;
  });
};
