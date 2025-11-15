import commentController from "../controllers/comment.controller.js";

const commentRouter = (route)=>{
    route.get("/getall", commentController.getAll)
    route.post("/create", commentController.addComment)
    route.put("/edit", commentController.editComment)
    route.delete("/delete", commentController.deleteComment)
}

export default commentRouter