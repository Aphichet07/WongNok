import reviewController from "../controllers/review.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";
const reviewRouter = (route) => {
  route.get("/shop/:id", reviewController.getReviewsByShop);

  route.post(
    "/create",
    userMiddleware.authMiddleware,
    reviewController.addReview
  );

  route.put("/:id", userMiddleware.authMiddleware, reviewController.editReview);

  route.delete(
    "/:id",
    userMiddleware.authMiddleware,
    reviewController.deleteReview
  );
};

export default reviewRouter;
