import shopService from "../services/shop.service.js";

const shopController = {
    test: (req, res) => {
        console.log("Hello from shopController")

        res.status(200).json({ message: shopService.test })
    },

    getRecommandShop: async (req, res) => {
        try {
            const shops = await shopService.getShopRecommand()
            res.status(200).json(shops);
        } catch (err) {
            res.status(500).json({ message: "Internal server error" });
        }
    },

    getShopbyName: async (req, res) => {
        console.log("Hello from getShopbyName")
    },
    filterShopAll: async (req, res) => {
        console.log("Hello from fillterShopAll")
    },

    filterByPrice: async (req, res) => {
        console.log("Hello from filterByPrice")
    },
    filterByStar: async (req, res) => {
        console.log("Hello from filterByStar")
    }

}


export default shopController