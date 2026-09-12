import express from "express";
import { login, logOut } from "../controller/auth.controller.js";

const router = express.Router();

// make login api
router.post("/login", login);
// make logout route
router.post("/logout", logOut);

export default router;
