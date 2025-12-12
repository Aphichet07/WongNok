import articleController from "../controllers/article.controller.js";
import userMiddleware from "../middlewares/user.middleware.js";

const articleRouter = (route) => {
  route.get("/recommend", articleController.recommandArticle);
  route.get("/search", articleController.searchByTag);
  route.get("/:id", articleController.readArticle);
  route.put("/:id/view", articleController.updateViewer);

  route.get("/:id/comments", articleController.getComment);
  route.post(
    "/:id/comments",
    userMiddleware.authMiddleware,
    articleController.comment
  );
  route.delete(
    "/comments/:commentId",
    userMiddleware.authMiddleware,
    articleController.deleteComment
  );
  route.put(
    "/comments/:commentId",
    userMiddleware.authMiddleware,
    articleController.updateComment
  );
};

export default articleRouter;
