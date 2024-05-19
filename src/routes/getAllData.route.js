
import express from 'express';
const router = express.Router();

import {register, loginUser} from "../controllers/user.controller.js";

router.post("/registerUser", register);
router.post("/loginUser", loginUser);

export default router;