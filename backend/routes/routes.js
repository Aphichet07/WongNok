import userRouter from "./user.route.js";
import shopRouter from "./shop.route.js";
import reviewRouter from "./review.route.js";
import commentRouter from "./comment.route.js"
import articleRouter from "./article.route.js";
import express from "express"

const router = express.Router()

const userRoutes = express.Router();
userRouter(userRoutes); 
router.use('/users', userRoutes);

const shopRoutes = express.Router();
shopRouter(shopRoutes); 
router.use('/shops', shopRoutes);

const reviewRoutes = express.Router();
reviewRouter(reviewRoutes); 
router.use('/review', reviewRoutes);

const commentRoutes = express.Router();
commentRouter(commentRoutes); 
router.use('/shops', commentRoutes);

const articleRoutes = express.Router();
articleRouter(articleRoutes); 
router.use('/article', articleRoutes);

export default router