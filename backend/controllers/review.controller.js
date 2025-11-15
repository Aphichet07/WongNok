import reviewService from "../services/review.service.js"

const reviewController = {
    getAll: async (req, res) => {
        console.log("Hello from reviewController")
    },
    addReview: async (req, res) => {
        try {
            const { shop_id, comment, rating, user_id } = req.body
            console.log(shop_id, comment, rating, user_id)
            const review = await reviewService.addReview(shop_id, comment, rating, user_id)
            console.log(review)
            res.status(200).json({ message: "success" , review})
        } catch (err) {
            res.status(500).json({ message: "Internal server error" })
        }
    },
    editReview: async (req, res) => {
        console.log("Hello from reviewController")
    },
    deleteReview: async (req, res) => {
        console.log("Hello from reviewController")
    }
}

export default reviewController