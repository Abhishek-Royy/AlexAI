import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();
app.use(express.json());

// agent er route ata
app.use("/", router);

app.get("/", (req, res) => {
  res.send("Hello from Agent");
});

app.listen(PORT, () => {
  console.log(`Agent started at http://localhost:${PORT}`);
  connectDB();
});
