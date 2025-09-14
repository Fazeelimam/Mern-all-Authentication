import { User } from "../Model/user.js";
import { catchErrorAsync } from "./catchErrorAsync.js";
import Errorhandler from "./middleware.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = catchErrorAsync(async(req,res,next)=>{
    // const {token} = req.body;
     let token;

  // Check cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
    if (!token) {
        return next(new Errorhandler("User is not Authenticated.",401));
    }
    const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY)
    // req.user = await User.findById(decoded.id);
      req.user = await User.findById(decoded.id);
  if (!req.user) {
    return next(new Errorhandler("User not found", 404));
  }
    next();
});