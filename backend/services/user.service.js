import db from "../utils/connectDB.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const SALT_ROUNDS = 10
const SECRET_KEY = "guruwamuengmairu"

const userService = {
    // ดึงข้ิอมูล user ทั้งหมด
    getAlluser: async () => {
        const queryText = `select id, username from "users"`
        const { rows } = await db.query(queryText)
        if (!rows) {
            return false
        }

        return JSON.stringify(rows)
    },
    // สมัครสมาชิก
    regist: async (username, password, email) => {
        const checkQuery = 'SELECT * FROM "users" WHERE email = $1';
        const { rows: existingUsers } = await db.query(checkQuery, [email]);

        if (existingUsers.length > 0) {
            return JSON.stringify({ error: 'This email is already registered.' });
        }

        const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

        const queryText = `
    INSERT INTO "users" (username, password, email)
    VALUES ($1, $2, $3)
    RETURNING id, username, email
  `;
        const values = [username, password_hash, email];
        const { rows } = await db.query(queryText, values);

        const user = rows[0];
        console.log(user);

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                username: user.username
            },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        return {
            message: 'Register successful!',
            token,
            user,
        };
    }
    ,
    // ล็อกอิน
    login: async (username, password) => {
        const query = `SELECT * FROM "users" WHERE username = $1`
        const { rows } = await db.query(query, [username])
        console.log(rows)
        if (!rows) {
            return JSON.stringify({ error: 'Invalid credentials' });
        }
        const user = rows[0]
        console.log(user)
        const isMatch = await bcrypt.compare(password, user.password)

        if (!isMatch) {
            return JSON.stringify({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({
            userId: user.id,
            email: user.email,
            username: user.username
        },
            SECRET_KEY,
            { expiresIn: '1h' })
        console.log(token)
        return {
            message: 'Login successful!', 
            token: token, 
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        }
    },
    // ใช้หา user เฉพาะคน
    findUser: async (userID) => {
        const { rows } = db.query('select * from "users" where id = $1', [userID])

        if (rows.length === 0) {
            return JSON.stringify({ error: 'Invalid credentials' });
        }
        return JSON.stringify({ rows })
    }

}

export default userService