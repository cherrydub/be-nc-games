const db = require("../db/connection");

exports.fetchReviewsById = (id) => {
  return db
    .query(
      `
      SELECT reviews.owner, reviews.title, reviews.review_body, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
      WHERE reviews.review_id = $1
      GROUP BY reviews.review_id
      ORDER BY reviews.created_at DESC;
    
    
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
//backup till here
const checkCategoryExists = (category) => {
  return db
    .query(`SELECT * FROM reviews WHERE category = $1`, [category])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 Category Not Found" });
      }
    });
};

const checkSortByExists = (sort_by) => {
  return db
    .query(
      `SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'reviews' AND column_name = $1`,
      [sort_by]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 Column Not Found" });
      }
      return Promise.resolve();
    });
};

const checkOrder = (order) => {
  const reg = /(asc|desc)/i;
  if (!reg.test(order)) {
    return Promise.reject({ status: 400, msg: "400 Bad Order Request" });
  }
  return Promise.resolve();
};

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const promises = [checkSortByExists(sort_by), checkOrder(order)];

  return Promise.all(promises).then(() => {
    let queryOne = `
      SELECT reviews.owner, reviews.title, reviews.review_id, reviews.category, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.designer, count(comments.review_id) AS comment_count
      FROM reviews
      LEFT JOIN comments
      ON comments.review_id = reviews.review_id
    `;
    const queryArr = [];

    if (category) {
      queryOne += `
        WHERE reviews.category = $1
      `;
      queryArr.push(category);
    }

    queryOne += ` GROUP BY reviews.review_id
    ORDER BY reviews.${sort_by} ${order};`;

    return db.query(queryOne, queryArr).then(({ rows }) => {
      if (rows.length === 0) {
        return checkCategoryExists(category).then(() => {
          return rows;
        });
      }
      return rows;
    });
  });
};

const checkIdExists = (review_id) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1`, [review_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 ID Not Found" });
      }
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
