import userService from "../services/user.service"

const userrController = {
    test: (req, res) => {
        req.json({ status: true, message: "Hello from user controller" })
    },

    register: async (req, res) => {
        try {
            const { username, password, email } = req.body
            if (!username || !password || !email) {
                console.log("Invalid Data")
                res.status(500).json({ message: "Data Invalid" })
            }

            const user = await userService.regist(username, password, email)
            res.status(201).json({
                message: "create user seuccess",
                username: user
            })

        } catch (err) {
            console.log("error : ", err)
            res.status(500).json({ message: "Internal server error" })
        }
    },

    login: async (req, res) => {
        try {
            const { username, password } = req.body
            if (!username || !password) {
                console.log("Data Invalid")
                res.status(500).json({ message: "DataInvalid" })
            }

            const token = await userService.login(username, password)
            res.status(200).json({ message: "Login success", token: token })

        } catch (err) {
            console.log("Error : ", err)
            res.status(500).json({ message: "Internal server error" })
        }
    },
    finduser: async (req, res) =>{
        try {
            const {userID} = req.body
            if (!userID){
                console.log("Data Invalid")
                res.status(500).json({message: "Data Invalid"})
            }

            const user = await userService.findUser(userId)
            res.status(200).json({message: "Founded", user: user})
        }catch(err){
            console.log("ERror: ", err)
            res.status(500).json({message: "Internal server eror"})
        }
    }
}

export default userrController