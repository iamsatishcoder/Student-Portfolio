// // import React, { useState } from "react";
// // import { registerUser } from "../api";

// // function Register() {
// //   const [form, setForm] = useState({ name: "", email: "", password: "" });
// //   const [message, setMessage] = useState("");

// //   const handleChange = (e) => {
// //     setForm({ ...form, [e.target.name]: e.target.value });
// //   };

// //   const handleSubmit = async (e) => {
// //     e.preventDefault();
// //     try {
// //       await registerUser(form);
// //       setMessage("✅ Registration successful! Now login.");
// //     } catch (err) {
// //       setMessage("❌ Error: " + (err.response?.data?.error || err.message));
// //     }
// //   };

// //   return (
// //     <div>
// //       <h2>Register</h2>
// //       <form onSubmit={handleSubmit}>
// //         <input name="name" placeholder="Name" onChange={handleChange} />
// //         <input name="email" type="email" placeholder="Email" onChange={handleChange} />
// //         <input name="password" type="password" placeholder="Password" onChange={handleChange} />
// //         <button type="submit">Register</button>
// //       </form>
// //       <p>{message}</p>
// //     </div>
// //   );
// // }

// // export default Register;


// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import API from "../services/api";

// function Register() {
//   const [form, setForm] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await API.post("/auth/register", form);
//       navigate("/login"); // redirect to login after successful register
//     } catch (err) {
//       setError(err.response?.data?.error || "Registration failed");
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       {error && <p style={{ color: "red" }}>{error}</p>}
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           name="name"
//           placeholder="Name"
//           value={form.name}
//           onChange={handleChange}
//           required
//         /><br />
//         <input
//           type="email"
//           name="email"
//           placeholder="Email"
//           value={form.email}
//           onChange={handleChange}
//           required
//         /><br />
//         <input
//           type="password"
//           name="password"
//           placeholder="Password"
//           value={form.password}
//           onChange={handleChange}
//           required
//         /><br />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }

// export default Register;

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    bio: "",
    contact: "",
    profile_image: ""
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/register", form);
      
      // Save user and token automatically after register (optional)
      if (res.data?.user && res.data?.token) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        navigate("/dashboard"); // redirect to dashboard after registration
      } else {
        navigate("/login"); // fallback to login page
      }
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Register</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        /><br />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        /><br />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        /><br />
        <input
          type="text"
          name="bio"
          placeholder="Bio (optional)"
          value={form.bio}
          onChange={handleChange}
        /><br />
        <input
          type="text"
          name="contact"
          placeholder="Contact (optional)"
          value={form.contact}
          onChange={handleChange}
        /><br />
       
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
