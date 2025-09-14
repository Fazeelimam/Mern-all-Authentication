// import React, { useContext, useState } from "react";
// import "../styles/ForgotPassword.css";
// import { Context } from "./Context";
// import { toast } from "react-toastify";
// import axios from "axios";
// const ForgotPassword = () => {
//   const { isAuthenticated } = useContext(Context);
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleForgotPassword = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       await axios
//         .post(
//           "http://localhost:4000/api/v1/password/forgot",
//           { email },
//           {
//             withCredentials: true,
//             headers: { "Content-Type": "application/json" },
//           }
//         )
//         .then((res) => {
//           toast.success(res.data.message);
//         })
//         .catch((error) => {
//           toast.error(error.response.data.message);
//         });
//     } catch (error) {
//       toast.error(error.response.data.message);
//     }
//   };
//   return (
//     <>
//       <div className="forgot-password-page">
//         <div className="forgot-password-container">
//           <h2>Forgot Password</h2>
//           <p>
//             Enter your registered email address to receive a password reset
//             code.
//           </p>
//           <form
//             onSubmit={handleForgotPassword}
//             className="forgot-password-form"
//           >
//             <input
//               type="email"
//               placeholder="Your email please"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//               className="forgot-input"
//             />
//             <button type="submit" className="forgot-btn" disabled={loading}>
//               {loading ? (
//                 <div className="spinner"></div>
//               ) : (
//                 "Request Pasword Reset"
//               )}
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };
// export default ForgotPassword;

import React, { useContext, useState, useEffect } from "react";
import "../styles/ForgotPassword.css";
import { Context } from "./Context";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { isAuthenticated } = useContext(Context);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Redirect logged-in users to homepage
  useEffect(() => {
    if (isAuthenticated) {
      toast.info("You are already logged in! Redirecting...");
      const timer = setTimeout(() => {
        navigate("/");
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated, navigate]);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/password/forgot",
        { email },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message || "Reset email sent!");
      setEmail(""); // clear input
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send reset email"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <div className="forgot-password-container">
        <h2>Forgot Password</h2>
        <p>
          Enter your registered email address to receive a password reset code.
        </p>
        <form onSubmit={handleForgotPassword} className="forgot-password-form">
          <input
            type="email"
            placeholder="Your email please"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="forgot-input"
          />
          <button type="submit" className="forgot-btn" disabled={loading}>
            {loading ? (
              <div className="spinner"></div>
            ) : (
              "Request Password Reset"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
