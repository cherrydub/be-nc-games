const { fetchReviewsById, fetchReviews } = require("../models/reviews.model");

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
