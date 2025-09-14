// import React, { useContext, useState } from "react";
// import { useForm } from "react-hook-form";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { Context } from "../pages/Context.jsx";
// import { Link, useNavigate } from "react-router-dom";
// const Login = () => {
//   const { setIsAuthenticated, setUser } = useContext(Context);
//   const navigateTo = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }, // ✅ fixed
//   } = useForm();

//   const handleLogin = async (data) => {
//     setLoading(true);
//     try {
//       await axios
//         .post("http://localhost:4000/api/v1/login", data, {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         })
//         .then((res) => {
//           toast.success(res.data.message, { theme: "light" });
//           setIsAuthenticated(true);
//           setUser(res.data.user);
//           navigateTo("/");
//         })
//         .catch((error) => {
//           toast.error(error.response?.data?.message || "Login failed");
//         });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <form
//       className="auth-form"
//       onSubmit={handleSubmit((data) => handleLogin(data))}
//     >
//       <h2>Login</h2>

//       <input
//         type="email"
//         placeholder="Please enter your email"
//         required
//         {...register("email")}
//       />

//       <input
//         type="password"
//         placeholder="Please enter your password"
//         required
//         {...register("password")}
//       />

//       <p className="forgot-password">
//         <Link to="/password/forgot">Forgot Password ?</Link>
//       </p>

//       <button type="submit" disabled={loading}>
//         {loading ? <div className="spinner"></div> : "Login"}
//       </button>
//     </form>
//   );
// };
// export default Login;
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../pages/Context.jsx";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:4000/api/v1/login", data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      toast.success(res.data.message || "Login successful!", {
        theme: "light",
      });
      setIsAuthenticated(true);
      setUser(res.data.user);
      navigate("/"); // ✅ better naming
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false); // ✅ ensure loading is reset
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit(handleLogin)}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Please enter your email"
        {...register("email", { required: "Email is required" })}
      />
      {errors.email && <p className="error">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Please enter your password"
        {...register("password", { required: "Password is required" })}
      />
      {errors.password && <p className="error">{errors.password.message}</p>}

      <p className="forgot-password">
        <Link to="/password/forgot">Forgot Password?</Link>
      </p>

      <button type="submit" disabled={loading}>
        {loading ? <div className="spinner"></div> : "Login"}
      </button>
    </form>
  );
};

export default Login;
