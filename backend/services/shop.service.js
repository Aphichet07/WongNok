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

//     filterShop: async (filters, { limit = 5, offset = 0 } = {}) => {
//         const params = [];
//         let p = 1;

//         const existsBlock = (category, values /* array */) => {
//             if (!values || values.length === 0) return '';
//             params.push(values);
//             const idx = p++;
//             return `
//       AND EXISTS (
//         SELECT 1
//         FROM "coffee_shop_tags" cst
//         JOIN "tags" tg ON tg.id = cst.tag_id
//         WHERE cst.shop_id = T1.id
//           AND tg.category = '${category}'
//           AND tg.slug = ANY($${idx}::text[])
//       )
//     `;
//             // ถ้าใช้ tag_id: AND tg.id = ANY($${idx}::int[])
//         };

//         let sql = `
//     SELECT DISTINCT T1.*
//     FROM "coffee_shops" AS T1
//     WHERE 1=1
//   `;

//         // ราคา (อย่างน้อยหนึ่งเมนูอยู่ในช่วง)
//         if (filters.minPrice || filters.maxPrice) {
//             const min = filters.minPrice ?? 0;
//             const max = filters.maxPrice ?? 1e9;
//             params.push(min, max);
//             sql += `
//       AND EXISTS (
//         SELECT 1
//         FROM "coffee_menus" AS T2
//         WHERE T2.shop_id = T1.id
//           AND T2.price BETWEEN $${p++} AND $${p++}
//       )
//     `;
//         }

//         // เรตติ้ง
//         if (filters.minRating) {
//             params.push(Number(filters.minRating));
//             sql += ` AND T1.average_rating >= $${p++} `;
//         }

//         // ชื่อร้าน
//         if (filters.name) {
//             params.push(`%${filters.name}%`);
//             sql += ` AND T1.name ILIKE $${p++} `;
//         }

//         // หมวดแท็ก (รองรับหลายค่าในหนึ่งหมวด)
//         const toArray = v => Array.isArray(v) ? v : (v ? [v] : []);
//         sql += existsBlock('roast', toArray(filters.roast));
//         sql += existsBlock('brew', toArray(filters.brew));
//         sql += existsBlock('profile', toArray(filters.profile));
//         sql += existsBlock('origin', toArray(filters.origin));
//         sql += existsBlock('vibe', toArray(filters.vibe));
//         sql += existsBlock('other', toArray(filters.other));

//         // จัดเรียง + แบ่งหน้า
//         params.push(limit, offset);
//         sql += ` ORDER BY T1.id DESC LIMIT $${p++} OFFSET $${p++};`;

//         const { rows } = await db.query(sql, params);
//         return rows;
//     }

    filterShop: async (filters) => {
        let queryValues = [];
        let paramIndex = 1;

        let queryText = 'SELECT DISTINCT T1.* FROM "coffee_shops" AS T1 ';
        let joins = [];
        let whereClauses = [];
        let havingClause = "";
        console.log("|")

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
        console.log("|")
        if (filters.minRating) {
            whereClauses.push(`T1.average_rating >= $${paramIndex++}`);
            queryValues.push(filters.minRating);
        }

        if (filters.name) {
            whereClauses.push(`T1.name ILIKE $${paramIndex++}`);
            queryValues.push(`%${filters.name}%`);
        }
        console.log("|")
        if (filters.tags) {
            joins.push('INNER JOIN "coffee_shop_tags" AS T3 ON T1.id = T3.shop_id');
            const tagIds = filters.tags.split(',').map(id => parseInt(id));

            whereClauses.push(`T3.tag_id = ANY($${paramIndex++}::int[])`);
            queryValues.push(tagIds);

            havingClause = `HAVING COUNT(DISTINCT T3.tag_id) = ${tagIds.length}`;
        }
        console.log("|")
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
        console.log("||")
        const { rows } = await db.query(queryText, queryValues);
        return rows;
    },


}


export default shopService