import userService from "../services/user.service.js"

const userController = {
    test: (req, res) => {
        res.json({ status: true, message: "Hello from user controller" })
    },

    register: async (req, res) => {
        try {
            const { username, password, email } = req.body;
            console.log("Hello form controller")
            console.log(username, password)
            const result = await userService.regist(username, password, email);

            if (result.error) {
                return res.status(400).json(result);
            }

            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },

    login: async (req, res) => {
        
        try {
            const { username, password } = req.body;
            console.log(req.body)
            const result = await userService.login(username, password);

            if (result.error) {
                return res.status(401).json(result);
            }
            
            res.json(result);
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: 'Server error' });
        }
    },
    finduser: async (req, res) => {
        try {
            const { userID } = req.body
            if (!userID) {
                console.log("Data Invalid")
                res.status(500).json({ message: "Data Invalid" })
            }

            const user = await userService.findUser(userId)
            res.status(200).json({ message: "Founded", user: user })
        } catch (err) {
            console.log("ERror: ", err)
            res.status(500).json({ message: "Internal server eror" })
        }
    }
}

export default userController