import shopController from "../controllers/shop.controller.js";

const shopRouter = (route) => {
    route.get("/test", shopController.test)
    route.get("/recommand", shopController.getRecommandShop)
    route.get("/:name", shopController.getShopbyName);
    route.post("/filter/all", shopController.filterShopAll);
    route.post("/filter/price", shopController.filterByPrice);
    route.post("/filter/star", shopController.filterByStar);
}

export default shopRouter