const {
  fetchReviewsById,
  fetchReviews,
  fetchReviewIdComments,
  createReviewIdComment,
  updateReviewVotes,
} = require("../models/reviews.model");

exports.getReviewById = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewsById(review_id)
    .then((reviewData) => {
      res.status(200).send({ review: reviewData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviews = (req, res) => {
  fetchReviews().then((allReviews) => {
    res.status(200).send({ reviews: allReviews });
  });
};

exports.getReviewIdComments = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewIdComments(review_id)
    .then((commentsData) => {
      res.status(200).send({ comments: commentsData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewIdComment = (req, res, next) => {
  const { review_id } = req.params;
  const postComment = req.body;

  createReviewIdComment(review_id, postComment)
    .then((resultData) => {
      res.status(201).send({ comment: resultData });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewIdVotes = (req, res, next) => {
  const { review_id } = req.params;
  const newVote = req.body;

  updateReviewVotes(review_id, newVote)
    .then((resultData) => {
      res.status(201).send({ review: resultData });
    })
    .catch((err) => {
      next(err);
    });
};
