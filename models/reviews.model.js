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
        return Promise.reject({ status: 404, msg: "404 ID Not Found" });
      }
      return rows[0];
    });
};

exports.fetchReviews = () => {
  const queryOne = `

  SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
  FROM reviews
  LEFT JOIN comments
  ON comments.review_id = reviews.review_id
  GROUP BY reviews.review_id
  ORDER BY reviews.created_at DESC;
`;
  return db.query(queryOne).then(({ rows }) => {
    return rows;
  });
};

exports.fetchReviewIdComments = (id) => {
  return db
    .query(
      `
  SELECT *
  FROM comments
  WHERE review_id = $1
  ORDER BY created_at DESC;
  `,
      [id]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return checkIdExists(id).then(() => {
          return rows;
        });
      }
      return rows;
    });
};

const checkIdExists = (review_id) => {
  return db
    .query("SELECT * FROM reviews WHERE review_id = $1", [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 ID Not Found" });
      }
    });
};

exports.createReviewIdComment = (review_id, postBody) => {
  return db
    .query(
      `
  INSERT INTO comments
  (review_id, author, body)
  VALUES
  ($1, $2, $3)
  RETURNING *;
  `,
      [review_id, postBody.username, postBody.body]
    )
    .then(({ rows }) => {
      return rows[0];
    });
};

exports.updateReviewVotes = (id, patchBody) => {
  return db
    .query(
      `
  UPDATE reviews
  SET votes = votes + $2
  WHERE review_id = $1
  RETURNING *;
  `,
      [id, patchBody.inc_votes]
    )
    .then(({ rows }) => {
      if (rows.length === 0) {
        return checkIdExists(id).then(() => {
          return rows;
        });
      }
      return rows[0];
    });
};
