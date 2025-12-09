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
};

export default articleController;


// import articleService from "../services/article.service.js";

// const articleController = {
//   test: (req, res) => {
//     res.status(200).json({ message: "Success" });
//   },
//   recommandArticle: async (req, res) => {
//     try {
//       const result = await articleService.recommandArticle();
//       res.status(200).json(result);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   searchByCategory: async (req, res) => {
//     try {
//       const category = req.query.category;
//       console.log(category);
//       if (!category) {
//         res.status(500).json({ message: "Data invalid" });
//       }

//       const result = await articleService.searchByCategory(category);
//       res.status(200).json(result);
//     } catch (err) {
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   updateViewer: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const article = await articleService.updateViewer(id);
//       res.status(200).json(article);
//     } catch (err) {
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   readArticle: async (req, res) => {
//     try {
//       const id = req.params.id;
//       const article = await articleService.readArticle(id);
//       res.status(200).json(article);
//     } catch (err) {
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },

//   comment: async (req, res) => {
//     try {
//       const articleId = req.params.id;

//       const { userId, comment } = req.body;

//       if (!articleId || !userId || !comment) {
//         return res
//           .status(400)
//           .json({
//             message: "Invalid Data: Missing articleId, userId, or comment",
//           });
//       }

//       const result = await articleService.comment(articleId, userId, comment);

//       res.status(201).json({
//         message: "Comment created successfully",
//         data: result,
//       });
//     } catch (err) {
//       console.error("Controller Error:", err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
//   getComment: async (req, res) => {
//     try {
//       const id = req.params.id;
//       if (!id) {
//         res.status(500).json({ message: "Data Invalid" });
//       }

//       const result = await articleService.getComment(id);
//       res.status(200).json(result);
//     } catch (err) {
//       console.log(err);
//       res.status(500).json({ message: "Internal server error" });
//     }
//   },
// };

// export default articleController;
