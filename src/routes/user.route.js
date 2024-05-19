import express from 'express';
const router = express.Router();
import { isUserAuthenticated } from "../middlewares/auth.js";

import { register, loginUser } from "../controllers/user.controller.js";
import { getAllUsers } from "../controllers/getAll.controller.js";

router.post("/registerUser", register);
router.post("/loginUser", loginUser);
router.get("/getAllUsers", isUserAuthenticated, getAllUsers);

export default router;