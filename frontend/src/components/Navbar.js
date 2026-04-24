// import React from "react";
// import { Link, useNavigate } from "react-router-dom";

// function Navbar() {
//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     navigate("/"); // after logout, go back to Home
//   };

//   return (
//     <nav
//       style={{
//         padding: "10px",
//         background: "#222",
//         color: "#fff",
//         display: "flex",
//         justifyContent: "space-between",
//       }}
//     >
//       {/* Left side links (always visible) */}
//       <div>
//         <Link to="/" style={{ margin: "10px", color: "#fff" }}>Home</Link>
//         <Link to="/education" style={{ margin: "10px", color: "#fff" }}>Education</Link>
//         <Link to="/skills" style={{ margin: "10px", color: "#fff" }}>Skills</Link>
//         <Link to="/projects" style={{ margin: "10px", color: "#fff" }}>Projects</Link>
//         <Link to="/resume" style={{ margin: "10px", color: "#fff" }}>Resume</Link>
//         <Link to="/contact" style={{ margin: "10px", color: "#fff" }}>Contact</Link>
//       </div>

//       {/* Right side auth buttons */}
//       <div>
//         {!token ? (
//           <>
//             <Link to="/login" style={{ margin: "10px", color: "#fff" }}>Login</Link>
//             <Link to="/register" style={{ margin: "10px", color: "#fff" }}>Register</Link>
//           </>
//         ) : (
//           <>
//             <Link to="/dashboard" style={{ margin: "10px", color: "#fff" }}>Dashboard</Link>
//             <Link to="/profile" style={{ margin: "10px", color: "#fff" }}>Profile</Link>
//             <button
//               onClick={handleLogout}
//               style={{
//                 margin: "10px",
//                 background: "transparent",
//                 border: "1px solid #fff",
//                 color: "#fff",
//                 cursor: "pointer",
//               }}
//             >
//               Logout
//             </button>
//           </>
//         )}
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/"); // after logout, go back to Home
  };

  return (
    <nav
      style={{
        padding: "10px",
        background: "#222",
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      {/* Left side links (always visible) */}
      <div>
        <Link to="/" style={{ margin: "10px", color: "#fff" }}>Home</Link>
        <Link to="/education" style={{ margin: "10px", color: "#fff" }}>Education</Link>
        <Link to="/skills" style={{ margin: "10px", color: "#fff" }}>Skills</Link>
        <Link to="/projects" style={{ margin: "10px", color: "#fff" }}>Projects</Link>
        <Link to="/portfolio" style={{ margin: "10px", color: "#fff" }}>Portfolio</Link>
        <Link to="/contact" style={{ margin: "10px", color: "#fff" }}>Contact</Link>
      </div>

      {/* Right side auth buttons */}
      <div>
        {!token ? (
          <>
            <Link to="/login" style={{ margin: "10px", color: "#fff" }}>Login</Link>
            <Link to="/register" style={{ margin: "10px", color: "#fff" }}>Register</Link>
          </>
        ) : (
          <>
            <Link to="/dashboard" style={{ margin: "10px", color: "#fff" }}>Dashboard</Link>
            <Link to="/profile" style={{ margin: "10px", color: "#fff" }}>Profile</Link>
            <button
              onClick={handleLogout}
              style={{
                margin: "10px",
                background: "transparent",
                border: "1px solid #fff",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
