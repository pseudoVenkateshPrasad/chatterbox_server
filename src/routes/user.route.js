import express from 'express';
const router = express.Router();
import { isUserAuthenticated } from "../middlewares/auth.js";

import { register, loginUser, generateNewAccessToken, logoutUser } from "../controllers/user.controller.js";
import { getAllUsers } from "../controllers/getAll.controller.js";

const protectLoginPage = (req, res, next) => {
    let isAuthenticated = false;
    if (req?.cookies?.accessToken?.length > 0 && req?.cookies?.refreshToken?.length > 0) { 
        isAuthenticated = true;
    };

    if (isAuthenticated) {
        res.redirect('/');
    } else {
        next();
    }
};

router.post("/registerUser", register);
router.post("/loginUser", protectLoginPage, loginUser);
router.get("/getAllUsers", isUserAuthenticated, getAllUsers);
router.get("/refresh", generateNewAccessToken);
router.get("/logoutUser", logoutUser);

export default router;