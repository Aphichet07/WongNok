import db from '../utils/connectDB.js'

const reviewService = {
    getReview: async () => {
        console.log("Hello from reviewService")
    },

    addReview: async (shop_id, comment, rating, user_id) => {
        const query = `
                INSERT INTO "reviews" (rating, comment, user_id)
                VALUES ($1, $2, $3)
                RETURNING id, rating, comment, user_id
        `
        const values = [ rating, comment, user_id];
        const { rows } = await db.query(query, values);
        return rows

    },
    deleteReview: async () => {
        console.log("Hello from reviewService")
    },
    editReview: async () => {
        console.log("Hello from reviewService")
    }
}

export default reviewService