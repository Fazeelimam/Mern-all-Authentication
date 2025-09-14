// import React, { useContext, useState } from "react";
// import "../styles/OtpVerification.css";
// import axios from "axios";
// import { Navigate, useParams } from "react-router-dom";
// import { toast } from "react-toastify";
// import { Context } from "./Context.jsx";

// const OtpVerification = () => {
//   const { isAuthenticated, setIsAuthenticated, user, setUser } =
//     useContext(Context);
//   const { email, phone } = useParams;
//   const [otp, SetOtp] = useState(["", "", "", "", ""]);

//   const handleChange = (value, index) => {
//     if (!/^\d*$/.test(value)) return;
//     const newOtp = [...otp];
//     newOtp[index] = value;
//     SetOtp(newOtp);

//     if (value && index < otp.length - 1) {
//       document.getElementById(`otp-input-${index + 1}`).focus();
//     }
//   };

//   const handleKeyDown = (e, index) => {
//     if (e.key === "Backspace" && otp[index] === "" && index) {
//       document.getElementById(`otp-input-${index - 1}`).focus();
//     }
//   };

//   const handleOTPVerification = async (e) => {
//     e.preventDefault();
//     const enteredOTP = otp.join("");
//     const data = {
//       email,
//       phone,
//       opt: enteredOTP,
//     };
//     axios
//       .post("http://localhost:4000/api/v1/verify-otp", data, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         setIsAuthenticated(true), setUser(res.data.user);
//       })
//       .catch((error) => {
//         toast.error(res.response.data.message);
//         setIsAuthenticated(false);
//         setUser(null);
//       });
//   };

//   if (isAuthenticated) {
//     return <Navigate to={"/"} />;
//   }
//   return (
//     <>
//       <div className="otp-verification-page">
//         <div className="otp-container">
//           <h1>OTP Verification</h1>
//           <p>Enter 5-digit OTP sent to your registered email or phone</p>
//           <form onSubmit={handleOTPVerification} className="otp-form">
//             <div className="otp-input-container">
//               {otp.map((digit, index) => {
//                 return (
//                   <input
//                     id={`otp-input${index + 1}`}
//                     type="text"
//                     maxLength={1}
//                     key={index}
//                     value={digit}
//                     onChange={(e) => handleChange(e.target.value, index)}
//                     onKeyDown={(e) => handleKeyDown(e, index)}
//                   />
//                 );
//               })}
//             </div>
//             <button type="submit" className="verify-button">
//               Verify OTP
//             </button>
//           </form>
//         </div>
//       </div>
//     </>
//   );
// };

// export default OtpVerification;

import React, { useContext, useState } from "react";
import "../styles/OtpVerification.css";
import axios from "axios";
import { Navigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "./Context.jsx";

const OtpVerification = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);
  const { email, phone } = useParams();
  const [otp, setOtp] = useState(["", "", "", "", ""]);

  const handleChange = (value, index) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      document.getElementById(`otp-input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && otp[index] === "" && index) {
      document.getElementById(`otp-input-${index - 1}`).focus();
    }
  };

  const handleOTPVerification = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("");
    const data = { email, phone, otp: enteredOTP };

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/verify-otp",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(res.data.message);
      setIsAuthenticated(true);
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed");
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="otp-verification-page">
      <div className="otp-container">
        <h2>OTP Verification</h2>
        <p>Enter the 5-digit OTP sent to your registered email or phone</p>
        <form onSubmit={handleOTPVerification} className="otp-form">
          <div className="otp-input-container">
            {otp.map((digit, index) => (
              <input
                id={`otp-input-${index}`}
                className="otp-input"
                type="text"
                maxLength={1}
                key={index}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>
          <button type="submit" className="verify-button">
            Verify OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default OtpVerification;
