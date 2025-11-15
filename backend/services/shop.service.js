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

    getShopByName: async (name) => {
        try {
            const queryText = `
            select * from coffee_shops where name = $1
        `
            console.log(name)
            const { rows } = await db.query(queryText, [name])
            console.log("Row: ", rows)
            return rows
        } catch (err) {
            console.error("Error in getRecommended service: ", err);
            throw err;
        }
    },

    filterShop: async (filters) => {
        const queryValues = [];

        const filterKeys = ['rating', 'roast', 'brew', 'profile', 'origin', 'vibe', 'other'];

        for (const key of filterKeys) {
            if (filters[key]) {
                queryValues.push(filters[key]);
            }
        }

        let queryText = `
        SELECT DISTINCT cs.id, cs.name, cs.description, cs.address, cs.cover_image_url, cs.average_rating
        FROM "coffee_shops" as cs
        JOIN "coffee_shop_tags" as cst ON cs.id = cst.shop_id
        JOIN "tags" as t ON cst.tag_id = t.id
    `;

        if (queryValues.length > 0) {
            const placeholders = queryValues.map((_, index) => `$${index + 1}`).join(', ');
            console.log("Placeholder : ", placeholders)
            queryText += ` WHERE t.name IN (${placeholders}) order by cs.average_rating desc`;
        }

        try {
            console.log("Executing Query:", queryText);
            console.log("With Values:", queryValues);

            const { rows } = await db.query(queryText, queryValues);

            return rows;

        } catch (err) {
            console.error("Error executing filterShop query:", err);
            throw err;
        }
    },


}


export default shopService