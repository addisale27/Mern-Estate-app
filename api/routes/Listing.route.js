import express from "express";

import { Create } from "../controllers/Listing.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();
router.post("/create", verifyToken, Create);
export default router;
