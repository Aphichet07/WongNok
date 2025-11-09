import db from '../utils/connectDB.js'

const shopService = {
    test: () => {
        return JSON.stringify("Hello from shopService")
    },

    getShopRecommand: async () => {
        try {
            const queryText = `
                SELECT * FROM "coffee_shops"
                ORDER BY "average_rating" DESC
                LIMIT 10
            `
            const { rows } = await db.query(queryText)
            return rows;
        } catch (err) { 
            console.error("Error in getRecommended service: ", err);
            throw err;
        }
    },

    getShopByName: async () => {
        // search name shop on search page
        console.log("Hello from GetShopByName")
    },

    filterShop: async () => {
        // filter all of fileter bar
        console.log("Hello from filterShop")
    },

    filterByPrice: async () => {
        console.log("Hello from filterByPrice")
    },

    filterByStar: async () => {
        console.log("Hello from filterByStar")
    }
}


export default shopService