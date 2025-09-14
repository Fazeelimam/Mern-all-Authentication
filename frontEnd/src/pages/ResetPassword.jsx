import React, { useContext, useState } from "react";
import "../styles/ResetPassword.css";
import axios from "axios";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "./Context";
const ResetPassword = () => {
  const { isAuthenticated } = useContext(Context);
  const { token } = useParams();
  const [password, SetPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigateTo = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    await axios
      .put(
        `http://localhost:4000/api/v1/password/reset/${token}`,
        { password, confirmPassword },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success(res.data.message);
        navigateTo("/auth");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }
  return (
    <>
      <div className="reset-password-page">
        <div className="reset-password-container">
          <h2>Reset Password</h2>
          <p>Enter your new password below.</p>
          <form className="reset-password-form" onSubmit={handleResetPassword}>
            <input
              type="password"
              placeholder="Your new password please"
              value={password}
              onChange={(e) => SetPassword(e.target.value)}
              className="reset-input"
              required
            />
            <input
              type="password"
              placeholder="Confirm password please"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="reset-input"
              required
            />
            <button type="submit" className="reset-btn">
              Reset Password
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;
