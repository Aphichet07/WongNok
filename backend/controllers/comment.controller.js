import commentService from "../services/comment.service.js"

const commentController = {
    getAll: async (req, res) => {
        console.log("Hello from commentController")
    },
    addComment: async (req, res) => {
        try {
            const {id, comment, username} = req.body
            console.log("Hello")
            console.log(id, comment, username)
            res.status(200).json({message: "success"})
        }catch (err){
            res.status(500).json({message: "Internal server error"})
        }
    },
    editComment: async (req, res) => {
        console.log("Hello from commentController")
    },
    deleteComment: async (req, res) => {
        console.log("Hello from commentController")
    }
}

export default commentController