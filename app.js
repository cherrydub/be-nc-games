const express = require("express");
const cors = require("cors");
const app = express();
const { getCategories } = require("./controllers/categories.controller");
const {
  getReviewById,
  getReviews,
  getReviewIdComments,
  postReviewIdComment,
  patchReviewIdVotes,
} = require("./controllers/reviews.controller");
const { getUsers } = require("./controllers/users.controller");
const { deleteCommentId } = require("./controllers/comments.controller");
const { getApi } = require("./controllers/api.controller");
const {
  handlePSQL400s,
  handleCustomErrors,
  handle500Statuses,
} = require("./controllers/errorHandlingControllers");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send(
    `<h1>Please check <a href='https://github.com/cherrydub/be-nc-games#readme'> README</a> for instructions.</h1>
      <br>
      <h1>Please click <a href='api/'> here for endpoints</a></h1>`
  );
});

app.get("/api", getApi);

app.get("/api/categories", getCategories);

app.get("/api/reviews", getReviews);

app.get("/api/reviews/:review_id", getReviewById);

app.get("/api/reviews/:review_id/comments", getReviewIdComments);

app.post("/api/reviews/:review_id/comments", postReviewIdComment);

app.patch("/api/reviews/:review_id", patchReviewIdVotes);

app.delete("/api/comments/:comment_id", deleteCommentId);

app.get("/api/users", getUsers);

app.use("/*", (req, res) => {
  res.status(404).send({ msg: "404 Path not found!!!" });
});

app.use(handlePSQL400s);
app.use(handleCustomErrors);
app.use(handle500Statuses);

module.exports = app;
