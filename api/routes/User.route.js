import express from "express";
import { test } from "../controllers/user.controller.js";
import {
  updateUser,
  deleteUser,
  getUserListing,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();
router.get("/test", test);
router.post("/update/:id", verifyToken, updateUser);
router.delete("/delete/:id", verifyToken, deleteUser);
router.get("/listings/:id", verifyToken, getUserListing);

export default router;
