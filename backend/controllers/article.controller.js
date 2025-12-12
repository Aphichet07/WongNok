import articleService from "../services/article.service.js";

const articleController = {
  test: (req, res) => {
    res.status(200).json({ message: "Article Service is working" });
  },

  recommandArticle: async (req, res) => {
    try {
      const result = await articleService.recommandArticle();
      res.status(200).json(result);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  searchByTag: async (req, res) => {
    try {
      const tag = req.query.tag;

      if (!tag) {
        return res.status(400).json({ message: "Tag parameter is required" });
      }

      const result = await articleService.searchByTag(tag);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateViewer: async (req, res) => {
    try {
      const id = req.params.id;
      const article = await articleService.updateViewer(id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json(article);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  readArticle: async (req, res) => {
    try {
      const id = req.params.id;
      const article = await articleService.readArticle(id);

      if (!article) {
        return res.status(404).json({ message: "Article not found" });
      }

      res.status(200).json(article);
    } catch (err) {
      res.status(500).json({ message: "Internal server error" });
    }
  },

  comment: async (req, res) => {
    try {
      const articleId = req.params.id;
      const { comment } = req.body;
      const userId = req.user ? req.user.id : req.body.userId;

      if (!articleId || !userId || !comment) {
        return res.status(400).json({
          message: "Invalid Data: Missing articleId, userId, or comment",
        });
      }

      const result = await articleService.comment(articleId, userId, comment);

      res.status(201).json({
        message: "Comment created successfully",
        data: result,
      });
    } catch (err) {
      console.error("Controller Error:", err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  getComment: async (req, res) => {
    try {
      const id = req.params.id;
      if (!id) {
        return res.status(400).json({ message: "Article ID is required" });
      }

      const result = await articleService.getComment(id);
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  deleteComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const userId = req.user?.id;

      if (!commentId || !userId) {
        return res
          .status(400)
          .json({ message: "Missing commentId or User ID" });
      }

      const deletedComment = await articleService.deleteComment(
        commentId,
        userId
      );

      if (!deletedComment) {
        return res
          .status(403)
          .json({
            message: "Cannot delete comment (Not authorized or Not found)",
          });
      }

      res
        .status(200)
        .json({ message: "Deleted successfully", data: deletedComment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  updateComment: async (req, res) => {
    try {
      const commentId = req.params.commentId;
      const { comment } = req.body; 
      const userId = req.user?.id;

      if (!commentId || !userId || !comment) {
        return res.status(400).json({ message: "Invalid data" });
      }

      const updatedComment = await articleService.updateComment(
        commentId,
        userId,
        comment
      );

      if (!updatedComment) {
        return res.status(403).json({ message: "Cannot update comment" });
      }

      res
        .status(200)
        .json({ message: "Updated successfully", data: updatedComment });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    }
  },
};

export default articleController;
