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
            const { rows } = db.query(queryText, [name])
            return rows
        } catch (err) {
            console.error("Error in getRecommended service: ", err);
            throw err;
        }
    },

    filterShop: async (filters) => {
        let queryValues = [];
        let paramIndex = 1;

        let queryText = 'SELECT DISTINCT T1.* FROM "coffee_shops" AS T1 ';
        let joins = [];
        let whereClauses = [];
        let havingClause = "";

        if (filters.minPrice || filters.maxPrice) {
            joins.push('INNER JOIN "coffee_menus" AS T2 ON T1.id = T2.shop_id');
            if (filters.minPrice) {
                whereClauses.push(`T2.price >= $${paramIndex++}`);
                queryValues.push(filters.minPrice);
            }
            if (filters.maxPrice) {
                whereClauses.push(`T2.price <= $${paramIndex++}`);
                queryValues.push(filters.maxPrice);
            }
        }

        if (filters.minRating) {
            whereClauses.push(`T1.average_rating >= $${paramIndex++}`);
            queryValues.push(filters.minRating);
        }

        if (filters.name) {
            whereClauses.push(`T1.name ILIKE $${paramIndex++}`);
            queryValues.push(`%${filters.name}%`);
        }

        if (filters.tags) {
            joins.push('INNER JOIN "coffee_shop_tags" AS T3 ON T1.id = T3.shop_id');
            const tagIds = filters.tags.split(',').map(id => parseInt(id));

            whereClauses.push(`T3.tag_id = ANY($${paramIndex++}::int[])`);
            queryValues.push(tagIds);

            havingClause = `HAVING COUNT(DISTINCT T3.tag_id) = ${tagIds.length}`;
        }

        if (joins.length > 0) {
            queryText += joins.join(' ');
        }
        if (whereClauses.length > 0) {
            queryText += " WHERE " + whereClauses.join(" AND ");
        }

        queryText += " GROUP BY T1.id ";

        if (havingClause) {
            queryText += havingClause;
        }

        const { rows } = await db.query(queryText, queryValues);
        return rows;
    },


}


export default shopService