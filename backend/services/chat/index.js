import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";


dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json())

app.get("/", (req, res) => {
  res.send("Hello from Chat");
});



app.listen(PORT, () => {
  console.log(`Chat started at http://localhost:${PORT}`);
  connectDB();
});
