import shopService from "../services/shop.service.js";

const shopController = {
    test:  (req, res)=>{
        console.log("Hello from shopController")
     
        res.status(200).json({message: shopService.test})
    },

    getRecommandShop: async (req, res) =>{
        console.log("Hello from getShop")
    },

    getShopbyName: async (req, res) =>{
        console.log("Hello from getShopbyName")
    },
    filterShopAll: async (req, res) =>{
        console.log("Hello from fillterShopAll")
    },

    filterByPrice: async (req, res) =>{
        console.log("Hello from filterByPrice")
    },
    filterByStar: async (req, res)=>{
        console.log("Hello from filterByStar")
    }

}


export default shopController