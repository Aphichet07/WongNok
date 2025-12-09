import reviewService from "../services/review.service.js";

const reviewController = {
  getReviewsByShop: async (req, res) => {
    try {
      const { id } = req.params; 
      console.log("shopId: ", id)
      const reviews = await reviewService.getReviewsByShopId(id);

      res.status(200).json(reviews);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
  addReview: async (req, res) => {
    try {
      const { shop_id, comment, rating } = req.body;
      const user_id = req.user.id;

      if (!shop_id || !rating) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const review = await reviewService.addReview(
        shop_id,
        comment,
        rating,
        user_id
      );
      res.status(201).json({ message: "Review created", review });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  editReview: async (req, res) => {
    try {
      const review_id = req.params.id;
      const { comment, rating } = req.body;
      const user_id = req.user.id;

      const updatedReview = await reviewService.editReview(
        review_id,
        comment,
        rating,
        user_id
      );

      if (!updatedReview) {
        return res
          .status(404)
          .json({ message: "Review not found or unauthorized" });
      }

      res
        .status(200)
        .json({ message: "Review updated", review: updatedReview });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteReview: async (req, res) => {
    try {
      const review_id = req.params.id;
      const user_id = req.user.id;

      const deleted = await reviewService.deleteReview(review_id, user_id);

      if (!deleted) {
        return res
          .status(404)
          .json({ message: "Review not found or unauthorized" });
      }

      res.status(200).json({ message: "Review deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default reviewController;
