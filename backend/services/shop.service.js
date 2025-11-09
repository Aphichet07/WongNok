import db from '../utils/connectDB.js'

const shopService = {
    test: ()=>{
        return JSON.stringify("Hello from shopService")
    },

    getShopRecommand: async ()=>{
        // load recommand shop on Home page
         console.log("Hello from HetAllRecommand")
    },

    getShopByName: async ()=>{
        // search name shop on search page
        console.log("Hello from GetShopByName")
    },

    filterShop: async ()=>{
        // filter all of fileter bar
        console.log("Hello from filterShop")
    }, 

    filterByPrice: async ()=>{
        console.log("Hello from filterByPrice")
    },

    filterByStar: async ()=>{
        console.log("Hello from filterByStar")
    }
}


export default shopService