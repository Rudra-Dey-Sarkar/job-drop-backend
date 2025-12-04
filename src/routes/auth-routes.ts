import { Router, Request, Response } from "express";
import { register, login } from "../controllers/auth-controller";

const router = Router();
// login
router.post("/register", register);
// register
router.post("/login", login);

export default router;
