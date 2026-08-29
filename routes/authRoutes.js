import express from "express";

import {
    signup,
    login,
    logout,
    profile 
}
from "../controllers/authController.js";

import isAuthenticated
from "../middleware/authMiddleware.js";

const router =
express.Router();

router.post(
    "/signup",
    signup
);

router.post(
    "/login",
    login
);

router.get(
    "/profile",
    isAuthenticated,
    profile
);

router.delete(
    "/logout",
    isAuthenticated,
    logout
);

export default router;