import jwt from "jsonwebtoken"
const SECRET_KEY = "guruwamuengmairu"

const userMiddleware = {
    authMiddleware:  (req, res, next) => {
        const authHeader = req.headers["authorization"];

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Unauthorized: Missing token" });
        }

        const token = authHeader.split(" ")[1];

        try {
            const payload = jwt.verify(token, SECRET_KEY);

            const userId = payload.userId;
            const email = payload.email;

            if (!userId) {
                return res.status(401).json({ message: "Unauthorized: invalid token payload" });
            }

            req.user = {
                id: userId,    
                email: email,
            };

            next();
        } catch (err) {
            console.error("JWT error:", err.message);
            return res.status(401).json({ message: "Unauthorized: invalid or expired token" });
        }
    }
}

export default userMiddleware