const db = require("../db/connection");

const checkIdExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "404 ID Not Found" });
      }
    });
};

exports.removeComment = (id) => {
  return checkIdExists(id)
    .then(() => {
      return db.query(
        `
  DELETE FROM comments
  WHERE comment_id = $1
  RETURNING *;
  `,
        [id]
      );
    })
    .then(({ rows }) => {
      return rows;
    });
};
