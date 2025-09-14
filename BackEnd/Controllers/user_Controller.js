import { catchErrorAsync } from "../Middleware/catchErrorAsync.js";
import Errorhandler from "../Middleware/middleware.js";
import { User } from "../Model/user.js";
import { sendEmail } from "../Utils/sendEmail.js";
import twilio from "twilio";
import { sendToken } from "../Utils/sendToken.js";
import crypto from "crypto";
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

export const register = catchErrorAsync(async (req, res, next) => {
  const { name, email, phone, password, verificationMethod } = req.body;

  if (!name || !email || !phone || !password || !verificationMethod) {
    return next(new Errorhandler("All fields are required", 400));
  }

  // phone validation
  function validatePhoneNumber(phone) {
    const phoneRegex = /^(?:\+92|0)?3\d{9}$/;
    return phoneRegex.test(phone);
  }

  if (!validatePhoneNumber(phone)) {
    return next(new Errorhandler("Invalid phone number", 400));
  }

  // verification method validation
  if (verificationMethod !== "email" && verificationMethod !== "phone") {
    return next(
      new Errorhandler("Invalid verification method. Use 'email' or 'phone'", 400)
    );
  }

  const existingUser = await User.findOne({
    $or: [
      { email, accountVerified: true },
      { phone, accountVerified: true },
    ],
  });

  if (existingUser) {
    return next(new Errorhandler("Phone or Email is already in use", 400));
  }

  const registrationAttemptByUser = await User.find({
    $or: [
      { phone, accountVerified: false },
      { email, accountVerified: false },
    ],
  });

  if (registrationAttemptByUser.length > 3) {
    return next(
      new Errorhandler(
        `You have reached maximum number of attempts (${registrationAttemptByUser.length}). Please try again after an hour`,
        400
      )
    );
  }

  const userData = { name, email, phone, password };
  const user = await User.create(userData);

  // generate code
  const verifiCode = user.generateVerificationCode();
  await user.save();

  const resultmessage = await sendVerificationCode(verificationMethod, verifiCode, email, phone, name);

  res.status(200).json({
    success: true,
    message: `${resultmessage}`,
  });
});


async function sendVerificationCode(verificationMethod, verificationCode, email, phone, name) {
  if (verificationMethod === "email") {
    const message = generateEmailTemplate(verificationCode);

    await sendEmail({
      email,
      subject: "Your Verification Code",
      message,
    });

    return `Verification email successfully sent to ${name}`;

  } else if (verificationMethod === "phone") {
    const verificationCodeWithSpace = verificationCode.toString().split("").join(" ");

    await client.messages.create({
      body: `Your verification code is: ${verificationCodeWithSpace}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone, // make sure this is in E.164 format, e.g., +923001234567
    });

    return `Verification SMS successfully sent to ${name}`;

  } else {
    throw new Errorhandler("Invalid verification method", 500);
  }
}

function generateEmailTemplate(verificationCode) {
  return `
  <div style="font-family: Arial, sans-serif; background-color: #f6f9fc; padding: 20px; text-align: center;">
    <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0px 4px 12px rgba(0,0,0,0.1); text-align: left;">
      
      <h1 style="font-size: 22px; color: #333333; margin-bottom: 16px;">
        Email Verification
      </h1>

      <p style="font-size: 15px; color: #555555; line-height: 1.6;">
        Hello User,
      </p>

      <p style="font-size: 15px; color: #555555; line-height: 1.6;">
        Use the following verification code to complete your signup:
      </p>

      <h2 style="font-size: 28px; color: #4CAF50; text-align: center; letter-spacing: 8px; margin: 20px 0;">
        ${verificationCode}
      </h2>

      <p style="font-size: 14px; color: #777777; margin-top: 20px; line-height: 1.6;">
        This code will expire in 10 minutes. If you did not request this, please ignore this email.
      </p>

      <div style="margin-top: 30px; font-size: 13px; color: #999999; text-align: center;">
        © 2025 Your Company. All rights reserved.
      </div>

    </div>
  </div>
  `;
}

export const verify_Otp = catchErrorAsync(async (req, res, next) => {
  const { email, otp, phone } = req.body;

  if (!otp) {
    return next(new Errorhandler("OTP is required", 400));
  }

  // Validate phone only if phone is provided
  if (phone) {
    const phoneRegex = /^(?:\+92|0)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      return next(new Errorhandler("Invalid phone number", 400));
    }
  }

  try {
    const userAllEntries = await User.find({
      $or: [
        { email, accountVerified: false },
        { phone, accountVerified: false }
      ]
    }).sort({ createdAt: -1 });

    if (!userAllEntries || userAllEntries.length === 0) {
      return next(new Errorhandler("User not found", 404));
    }

    let user = userAllEntries[0];

    // If there are multiple unverified entries, keep the latest and delete the rest
    if (userAllEntries.length > 1) {
      await User.deleteMany({
        _id: { $ne: user._id },
        $or: [
          { email, accountVerified: false },
          { phone, accountVerified: false }
        ]
      });
    }

    // OTP check
    if (Number(user.verificationCode) !== Number(otp)) {
      return next(new Errorhandler("Invalid OTP", 400));
    }

    // Expiry check
    const currentTime = Date.now();
    const verificationCodeExpire = new Date(user.verificationCodeExpire).getTime();
    if (currentTime > verificationCodeExpire) {
      return next(new Errorhandler("OTP Expired.", 400));
    }

    // Mark verified
    user.accountVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpire = null;
    await user.save({ validateModifiedOnly: true });

    // Send response
    sendToken(user, 200, "Account verified", res);
  } catch (error) {
    return next(new Errorhandler(error.message || "Internal Server Error", 500));
  }
});

export const login = catchErrorAsync(async (req, res, next) => {
  // ✅ Check if request body exists
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new Errorhandler("Please provide email and password.", 400));
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return next(new Errorhandler("Both email and password are required.", 400));
  }

  // ✅ Find user and ensure account is verified
  const userDetail = await User.findOne({ email, accountVerified: true }).select("+password");
  if (!userDetail) {
    return next(new Errorhandler("No account found with this email or account is not verified.", 400));
  }

  // ✅ Match password
  const isPasswordMatched = await userDetail.comparePassword(password);
  if (!isPasswordMatched) {
    return next(new Errorhandler("Incorrect password. Please try again.", 400));
  }

  // ✅ Send token with a friendly message
  sendToken(userDetail, 200, `Welcome back, ${userDetail.name}! 🎉`, res);
});

export const logOut = catchErrorAsync(async(req,res,next)=>{
  res.status(200).cookie("token","",{
    expires:new Date(Date.now()),
    httpOnly:true,
  }).json({
    success: true,
    message: "Logged Out successfully"
  })
})

export const getUser = catchErrorAsync(async(req,res,next)=>{
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  })
})

export const forgotPassword = catchErrorAsync(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    accountVerified: true,
  });

  if (!user) {
    return next(new Errorhandler("User not found", 404));
  }

  // FIX: call method on user
  const resetToken = user.generateResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  const resetPasswordUrl = `${process.env.FRONTEND_URL}/password/reset/${resetToken}`;
  const message = `Your reset password link is: ${resetPasswordUrl} \n\nIf you did not request this, please ignore it.`;

  try {
    await sendEmail({
      email: user.email,
      subject: "RESET APP PASSWORD",
      message,
    });

    res.status(200).json({
      success: true,
      message: `Email sent to ${user.email} successfully.`,
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new Errorhandler(
        error.message ? error.message : "Cannot send reset password token."
      )
    );
  }
});

export const resetPassword = catchErrorAsync(async (req, res, next) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body || {};

  // 🔹 Check token first
  if (!token) {
    return next(new Errorhandler("Reset token is required", 400));
  }

  // 🔹 Validate password fields before DB query
  if (!password || !confirmPassword) {
    return next(new Errorhandler("Password and Confirm Password are required", 400));
  }

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new Errorhandler("Reset password token is invalid or has expired", 400));
  }

  if (password !== confirmPassword) {
    return next(new Errorhandler("Password & Confirm password doesn't match", 400));
  }

  user.password = password;
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;

  await user.save();

  sendToken(user, 200, "Reset Password successfully", res);
});


