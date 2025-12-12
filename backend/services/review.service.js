import db from '../utils/connectDB.js'

const reviewService = {
    // ดึงรีวิวเมื่อ user เข้ามาหน้า shop 
    getReviewsByShopId: async (shop_id) => {
        const query = `
            SELECT 
                r.id, 
                r.user_id,
                r.rating, 
                r.comment, 
                r.created_at, 
                u.username 
            FROM reviews r
            JOIN users u ON r.user_id = u.id
            WHERE r.shop_id = $1
            ORDER BY r.created_at DESC
        `;
        const { rows } = await db.query(query, [shop_id]);
        console.log(rows)
        return rows;
    },
    // สร้าง review เมื่อ user เขียนรีวิว
    addReview: async (shop_id, comment, rating, user_id) => {
        
        const query = `
            INSERT INTO "reviews" (shop_id, rating, comment, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING *
        `;
        const values = [shop_id, rating, comment, user_id];
        const { rows } = await db.query(query, values);
        return rows[0];
    },
    // แก้รีวิว
    editReview: async (review_id, comment, rating, user_id) => {
        const query = `
            UPDATE "reviews"
            SET comment = $1, rating = $2, updated_at = NOW()
            WHERE id = $3 AND user_id = $4
            RETURNING *
        `;
        const values = [comment, rating, review_id, user_id];
        const { rows } = await db.query(query, values);
        
        return rows[0]; 
    },
    // ลบรีวิว
    deleteReview: async (review_id, user_id) => {
        const query = `
            DELETE FROM "reviews"
            WHERE id = $1 AND user_id = $2
            RETURNING id
        `;
        const values = [review_id, user_id];
        const { rows } = await db.query(query, values);
        return rows[0];
    }
}

export default reviewService