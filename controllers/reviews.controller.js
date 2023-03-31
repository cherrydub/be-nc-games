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
    .then((review) => {
      res.status(200).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
//backup till here
exports.getReviews = (req, res, next) => {
  const { category, sort_by, order } = req.query;

  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      res.status(200).send({ reviews });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getReviewIdComments = (req, res, next) => {
  const { review_id } = req.params;

  fetchReviewIdComments(review_id)
    .then((comments) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postReviewIdComment = (req, res, next) => {
  const { review_id } = req.params;
  const postComment = req.body;

  createReviewIdComment(review_id, postComment)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};

exports.patchReviewIdVotes = (req, res, next) => {
  const { review_id } = req.params;
  const newVote = req.body;

  updateReviewVotes(review_id, newVote)
    .then((review) => {
      res.status(201).send({ review });
    })
    .catch((err) => {
      next(err);
    });
};
