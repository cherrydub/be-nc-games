const { fetchReviewsById } = require("../models/reviews.model");

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
