import articleController from "../controllers/article.controller.js";

const articleRouter = (route) => {
  route.get("/test", articleController.test);
  route.get("/recommend", articleController.recommandArticle); 
  
  route.get("/category", articleController.searchByCategory); 

  route.get("/:id/read", articleController.readArticle);
  route.get("/:id/view", articleController.updateViewer);
  route.get("/:id/getcomment", articleController.getComment);
  route.post("/:id/comment", articleController.comment);
};

export default articleRouter;
