import shopController from "../controllers/shop.controller.js";

const shopRouter = (route) => {
    route.get("/test", shopController.test)
    route.get("/recommend", shopController.getRecommandShop)
    route.get("/nearby", shopController.recommendNearby);
    route.get("/filter", shopController.filterShopAll)
    route.get("/search", shopController.search);
    route.post("/name", shopController.getShopbyName)
}

export default shopRouter