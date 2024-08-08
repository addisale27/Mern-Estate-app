import express from "express";

import { Create, deleteListing } from "../controllers/Listing.controller.js";
import { verifyToken } from "../utils/VerifyUser.js";
const router = express.Router();
router.post("/create", verifyToken, Create);
router.delete("/delete/:id", verifyToken, deleteListing);
export default router;
