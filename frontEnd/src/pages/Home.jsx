// import React, { useContext } from "react";
// import Hero from "../components/Hero";
// import Instructor from "../components/Instructor";
// import Technologies from "../components/Technologies";
// import "../styles/Home.css";
// import { toast } from "react-toastify";
// import axios from "axios";
// import { Context } from "../pages/Context.jsx";
// import { Navigate, useNavigate } from "react-router-dom";
// import Footer from "../layout/Footer";
// const Home = () => {
//   const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

//   const Logout = async () => {
//     await axios
//       .get("http://localhost:4000/api/v1/logout", {
//         withCredentials: true,
//       })
//       .then((res) => {
//         toast.success(res.data.message);
//         setUser(null);
//         setIsAuthenticated(false);
//       })
//       .catch((error) => {
//         toast.error(error.response.data.message);
//       });
//   };
//   if (!isAuthenticated) {
//     return <Navigate to={"/auth"} />;
//   }
//   return (
//     <>
//       <section>
//         <Hero />
//         <Technologies />
//         <Footer />
//         <button onClick={Logout}>Logout</button>
//       </section>
//     </>
//   );
// };
// export default Home;

import React, { useContext } from "react";
import Hero from "../components/Hero";
import Technologies from "../components/Technologies";
import Footer from "../layout/Footer";
import "../styles/Home.css";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../pages/Context.jsx";
import { Navigate } from "react-router-dom";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const Logout = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/logout", {
        withCredentials: true,
      });
      toast.success(res.data.message);
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return (
    <div className="home">
      {/* Navbar with Logout button */}
      <header className="home-header">
        <h2 className="logo">MERN Authentication</h2>
        <button className="logout-btn" onClick={Logout}>
          Logout
        </button>
      </header>

      {/* Hero Section */}
      <main>
        <Hero />

        {/* Technologies Section */}
        <Technologies />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
