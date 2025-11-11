import userRouter from "./user.route.js";
import shopRouter from "./shop.route.js";
import express from "express"

const router = express.Router()

const userRoutes = express.Router();
userRouter(userRoutes); 
router.use('/users', userRoutes);

const shopRoutes = express.Router();
shopRouter(shopRoutes); 
router.use('/shops', shopRoutes);


export default router