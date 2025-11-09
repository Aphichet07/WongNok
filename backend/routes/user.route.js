import userController from "../controllers/user.controller.js";

const userRouter = (route)=> {
    route.get("/test", userController.test)
    route.post("/signup", userController.register)
    route.post("/signin", userController.login)
    route.post("/findUserByID", userController.finduser)
}

export default userRouter