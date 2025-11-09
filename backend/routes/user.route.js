import userController from "../controllers/user.controller";

const userRouter = (route)=> {
    route.post("/signup", userController.register)
    route.post("/signin", userController.login)
    route.post("/findUserByID", userController.finduser)
}

export default userRouter