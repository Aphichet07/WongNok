import userRoute from "./user.route";
import express from "express"

const router = express.Router()

const userRoutes = express.Router();
userRouter(userRoutes); 
router.use('/users', userRoutes);


export default router