import reviewController from "../controllers/review.controller.js"
import userMiddleware from "../middlewares/user.middleware.js"
const reviewRouter = (route) =>{
    route.get("/get", reviewController.getAll)
    route.post("/create", userMiddleware.authMiddleware,reviewController.addReview)
    route.put("/edit", reviewController.editReview)
    route.delete("/delete", reviewController.deleteReview)
}

export default reviewRouter