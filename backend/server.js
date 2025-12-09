import express from "express";
import cors from "cors";
import path from "path";
import 'dotenv/config'; 
import router from "../backend/routes/routes.js";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({
    origin: '*', 
    credentials: true
}));
app.use(express.json());
app.use(router)




app.use("/frontend", express.static(path.join(__dirname, "..", "frontend")));

app.get("/", (_req, res) => {
  res.sendFile(path.join(__dirname, "..", "frontend", "index.html"));
});

app.listen(3000, () => {
  console.log("http://127.0.0.1:3000");
});

