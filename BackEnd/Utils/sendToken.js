export const sendToken = (user, statusCode, message, res) => {
  const token = user.generateToken();

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,   // Corrected
      secure: process.env.NODE_ENV === "production", // Optional for HTTPS
      sameSite: "strict", // Helps prevent CSRF
    })
    .json({
      success: true,
      user,
      message,
      token,
    });
};
