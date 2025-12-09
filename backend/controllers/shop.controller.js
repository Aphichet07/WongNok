import shopService from "../services/shop.service.js";

const shopController = {
    test: (req, res) => {
        console.log("Hello from shopController")

        res.status(200).json({ message: shopService.test })
    },

    getRecommandShop: async (req, res) => {
        try {
            const shops = await shopService.getRecommended()
            res.status(200).json(shops);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getShopbyName: async (req, res) => {
        try {
            const {name} = req.body
            const shop = await shopService.getShopByName(name)
            if (!shop){
                res.status(500).json({message: "can not found"})
            }
            console.log("Shop : ", shop)
            res.status(200).json(shop)

        }catch(err){
            res.status(500).json({ message: "Internal server error" });
        }
    },

    filterShopAll: async (req, res) => {
        try {
            const filters = req.query;
            console.log(filters)
            const shops = await shopService.filterShop(filters);
            console.log(shops)
            res.status(200).json(shops);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    },

    filterByPrice: async (req, res) => {
        console.log("Hello from filterByPrice")
    },
    filterByStar: async (req, res) => {
        console.log("Hello from filterByStar")
    }

}


export default shopController