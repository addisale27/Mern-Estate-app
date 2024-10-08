import express from "express";
import {
  signIn,
  signUp,
  OAuth,
  SignOut,
} from "../controllers/Auth.controller.js";
const router = express.Router();
router.post("/signup", signUp);
router.post("/signin", signIn);
router.post("/google", OAuth);
router.get("/signout", SignOut);

export default router;
