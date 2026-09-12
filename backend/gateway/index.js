import express from "express";
import dotenv from "dotenv";
import proxy from "express-http-proxy";
import cors from "cors";
import cookieParser from "cookie-parser";
import protect from "./middleware/auth.middleware.js";
import { getCurrentUser } from "./controller/user.controller.js";

dotenv.config();
const PORT = process.env.PORT;
const app = express();

// apply cors policy
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  }),
);

app.use(cookieParser());

// if some come to /auth then it send this url
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
// -------------------------
app.use("/api/me",protect,getCurrentUser)

app.listen(PORT, () => {
  console.log(`Gateway started at http://localhost:${PORT}`);
});
