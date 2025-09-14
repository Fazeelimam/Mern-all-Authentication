// import React, { useContext, useState } from "react";
// import "../styles/Auth.css";
// import { Context } from "../pages/Context.jsx";
// import { Navigate } from "react-router-dom";
// import Login from "../components/Login.jsx";
// import Register from "../components/Register.jsx";
// const Auth = () => {
//   const { isAuthenticated } = useContext(Context);
//   const [isLogin, SetIsLogin] = useState(false);
//   if (isAuthenticated) {
//     return <Navigate to={"/"} />;
//   }

//   return (
//     <>
//       <div className="auth-page">
//         <div className="auth-container">
//           <div className="auth-toggle">
//             <button
//               className={`toggle-btn ${isLogin ? "active" : ""}`}
//               onClick={() => SetIsLogin(true)}
//             >
//               Login
//             </button>
//             <button
//               className={`toggle-btn ${!isLogin ? "active" : ""}`}
//               onClick={() => SetIsLogin(false)}
//             >
//               Register
//             </button>
//           </div>
//           {isLogin ? <Login /> : <Register />}
//         </div>
//       </div>
//     </>
//   );
// };
// export default Auth;
import React, { useContext, useState } from "react";
import "../styles/Auth.css";
import { Context } from "../pages/Context.jsx";
import { Navigate } from "react-router-dom";
import Login from "../components/Login.jsx";
import Register from "../components/Register.jsx";

const Auth = () => {
  const { isAuthenticated } = useContext(Context);
  const [isLogin, setIsLogin] = useState(true); // default to Login

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-toggle">
          <button
            className={`toggle-btn ${isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`toggle-btn ${!isLogin ? "active" : ""}`}
            onClick={() => setIsLogin(false)}
          >
            Register
          </button>
        </div>

        <div className="auth-form-wrapper">
          <div className={`form-slide ${isLogin ? "show" : "hide"}`}>
            <Login />
          </div>
          <div className={`form-slide ${!isLogin ? "show" : "hide"}`}>
            <Register />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
