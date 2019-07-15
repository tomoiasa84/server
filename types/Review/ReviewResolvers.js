const reviewResolvers = {
  Query: {
    get_review: (root, { reviewId }, { knexModule }) => {
      return knexModule.getById("TagReviews", reviewId).catch(error => {
        throw error;
      });
    },
    get_reviews: (root, args, { knexModule }) => {
      return knexModule.getAll("TagReviewsv");
    }
  },
  Review: {
    author: (review, args, { knexModule }) => {
      return knexModule.getById("Users", review.user).catch(error => {
        throw error;
      });
    },
    userTag: (review, args, { knexModule }) => {
      return knexModule.getById("UserTags", review.userTag).catch(error => {
        throw error;
      });
    }
  }
};

module.exports = reviewResolvers;
