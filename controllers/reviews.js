const Walk = require('../models/walk');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const walk = await Walk.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
  walk.reviews.push(review);
  await review.save();
  await walk.save();
  req.flash('success', 'Posted new review');
  res.redirect(`/walks/${walk._id}`);
};


module.exports.deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;
  await Walk.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  req.flash('success', 'Deleted review');
  res.redirect(`/walks/${id}`);
};