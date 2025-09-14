import mongoose from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import crypto from "crypto"

const userSchema = new mongoose.Schema({
    name: String,
    email: { 
    type: String, 
    required: true, 
    index: true 
},
    password:{
        type:String,
        minLenght:[7,"Password should be atleast 6 charachters."],
        maxLenght:[32,"Password cannot be exceed above 32 charachters."],
        select: false
    },
    phone:String,
    accountVerified:{type:Boolean,default:false},
    verificationCode:Number,
    verificationCodeExpire:Date,
    resetPasswordToken:String,
    resetPasswordExpire:Date,
    createdAt:{
        type:Date,
        default:Date.now
    }
})

userSchema.pre("save",async function (next) {
    if (!this.isModified("password")) {
        next();
    }
    this.password = await bcrypt.hash(this.password,10)
})

userSchema.methods.comparePassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword,this.password)
};

userSchema.methods.generateVerificationCode = function() {
    // Generate a 5-digit random number (100000 - 999999)
    const verificationCode = Math.floor(10000 + Math.random() * 90000);

    // Save code and expiry (5 minutes from now)
    this.verificationCode = verificationCode;
    this.verificationCodeExpire = Date.now() + 10 * 60 * 1000; // 5 minutes

    return verificationCode;
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id }, 
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

userSchema.methods.generateResetPasswordToken = function(){
    const resetToken = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    return resetToken;
}
export const User = mongoose.model("User",userSchema)