import express from "express"
import { forgotPassword, getUser, login, logOut, register, resetPassword, verify_Otp } from "../Controllers/user_Controller.js";
import { isAuthenticated } from "../Middleware/auth.js";

const router = express.Router();
router.post("/register",register);


router.post("/verify-otp",verify_Otp);
router.post("/login",login)
router.get("/logout",isAuthenticated,logOut)
router.get("/getUser",isAuthenticated,getUser)
router.post("/password/forgot",forgotPassword)
router.put("/password/reset/:token",resetPassword)

export default router;