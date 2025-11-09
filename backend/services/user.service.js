import db from "../utils/connectDB.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SALT_ROUNDS = 10
const SECRET_KEY = "guruwamuengmairu"

const userService = {
    getAlluser: async () => {
        const queryText = `select id, username from "user"`
        const { rows } = db.query(queryText)
        if (!rows) {
            return false
        }

        return JSON.stringify(rows)
    },

    regist: async (username, password, email) => {
        const checkQuery = 'select * from "user" where email = $1'
        const { rows: existingUsers } = await db.query(checkQuery, [email])

        if (existingUsers.length > 0) {
            return JSON.stringify({ error: 'This email is already registered.' });
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS)

        const queryText = `
                insert into "user" (username, password, eamil)
                values($1,$2,$3)
                returning id, username, email
        `
        const values = [username, password_hash, email]
        const { rows } = await db.query(queryText, values)
        console.log(rows)
        return JSON.stringify(rows[1])
    },

    login: async (username, password) => {
        const { rows } = db.query('select * from "user" where username = $1', [username])
        if (rows.length === 0) {
            return JSON.stringify({ error: 'Invalid credentials' });
        }
        const user = rows[0]

        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return JSON.stringify({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email
        },
            SECRET_KEY,
            { expiresIn: '1h' })

        return JSON.stringify({ message: 'Login successful!', token: token });
    },

    findUser: async (userID) => {
        const {rows} = db.query('select * from "user" where id = $1', [userID])

        if (rows.length === 0){
            return JSON.stringify({ error: 'Invalid credentials' });
        }
        return JSON.stringify({rows})
    }

}

export default userService