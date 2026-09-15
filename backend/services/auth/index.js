import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import router from "./routes/auth.route.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello from auth");
});
// USE THE ROUTER
app.use("/",router);


app.listen(PORT, () => {
  console.log(`Auth started at http://localhost:${PORT}`);
  connectDB();
});
