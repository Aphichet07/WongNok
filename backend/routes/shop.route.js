import shopController from "../controllers/shop.controller.js";

const shopRouter = (route) => {
    route.get("/test", shopController.test)
    route.get("/recommand", shopController.getRecommandShop)
    route.get("/filter", shopController.filterShopAll)
    route.post("/name", shopController.getShopbyName)
    
}

export default shopRouter