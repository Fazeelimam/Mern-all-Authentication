// import { useForm } from "react-hook-form";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import { toast } from "react-toastify";
// import { useState } from "react";
// const Register = () => {
//   const navigateTo = useNavigate();
//   const [loading, setLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors }, // ✅ fixed
//   } = useForm();

//   const handleRegister = async (data) => {
//     setLoading(true);
//     try {
//       data.phone = `+92${data.phone}`;
//       await axios
//         .post("http://localhost:4000/api/v1/register", data, {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         })
//         .then((res) => {
//           toast.success(res.data.message, { theme: "light" });
//           navigateTo(`/otp-verification/${data.email}/${data.phone}`);
//         })
//         .catch((error) => {
//           toast.error(error.response?.data?.message || "Registration failed");
//         });
//     } catch (error) {
//       toast.error(error.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div>
//       <form
//         className="auth-form"
//         onSubmit={handleSubmit((data) => handleRegister(data))}
//       >
//         <h2>Register</h2>

//         <input
//           type="text"
//           placeholder="Your name please"
//           required
//           {...register("name")}
//         />

//         <input
//           type="email"
//           placeholder="Your email please"
//           required
//           {...register("email")}
//         />

//         <div className="phone-input">
//           <span>+92</span>
//           <input
//             type="number"
//             placeholder="Phone Number please"
//             required
//             {...register("phone")}
//           />
//         </div>

//         <input
//           type="password"
//           placeholder="Your Password please"
//           required
//           {...register("password")}
//         />

//         <div className="verification-method">
//           <p>Select Verification Method</p>
//           <div className="wrapper">
//             <label>
//               <input
//                 type="radio"
//                 name="verificationMethod"
//                 value="email"
//                 {...register("verificationMethod")}
//                 required
//               />
//               Email
//             </label>
//             <label>
//               <input
//                 type="radio"
//                 name="verificationMethod"
//                 value="phone"
//                 {...register("verificationMethod")}
//                 required
//               />
//               Phone
//             </label>
//           </div>
//         </div>

//         <button type="submit" disabled={loading}>
//           {loading ? <div className="spinner"></div> : "Register"}
//         </button>
//       </form>
//     </div>
//   );
// };
// export default Register;

import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleRegister = async (data) => {
    setLoading(true);
    try {
      // Add country code to phone
      data.phone = `+92${data.phone}`;

      const res = await axios.post(
        "http://localhost:4000/api/v1/register",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(res.data.message || "Registration successful!", {
        theme: "light",
      });

      // Navigate to OTP verification page
      navigate(`/otp-verification/${data.email}/${data.phone}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <form className="auth-form" onSubmit={handleSubmit(handleRegister)}>
        <h2>Register</h2>

        <input
          type="text"
          placeholder="Your name please"
          {...register("name", { required: "Name is required" })}
        />
        {errors.name && <p className="error">{errors.name.message}</p>}

        <input
          type="email"
          placeholder="Your email please"
          {...register("email", { required: "Email is required" })}
        />
        {errors.email && <p className="error">{errors.email.message}</p>}

        <div className="phone-input">
          <span>+92</span>
          <input
            type="number"
            placeholder="Phone Number please"
            {...register("phone", { required: "Phone number is required" })}
          />
        </div>
        {errors.phone && <p className="error">{errors.phone.message}</p>}

        <input
          type="password"
          placeholder="Your Password please"
          {...register("password", { required: "Password is required" })}
        />
        {errors.password && <p className="error">{errors.password.message}</p>}

        <div className="verification-method">
          <p>Select Verification Method</p>
          <div className="wrapper">
            <label>
              <input
                type="radio"
                value="email"
                {...register("verificationMethod", { required: true })}
              />
              Email
            </label>
            <label>
              <input
                type="radio"
                value="phone"
                {...register("verificationMethod", { required: true })}
              />
              Phone
            </label>
          </div>
        </div>
        {errors.verificationMethod && (
          <p className="error">Please select a verification method</p>
        )}

        <button type="submit" disabled={loading}>
          {loading ? <div className="spinner"></div> : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;
