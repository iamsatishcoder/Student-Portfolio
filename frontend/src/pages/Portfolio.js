
// import React, { useEffect, useState } from "react";
// import API from "../services/api";
// import jsPDF from "jspdf";

// function Portfolio() {
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const res = await API.get("/portfolio");
//         setPortfolio(res.data);
//       } catch (err) {
//         console.error("Error fetching portfolio:", err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPortfolio();
//   }, []);

//   const handleDownload = () => {
//     if (!portfolio) return;

//     const doc = new jsPDF();

//     // Title
//     doc.setFontSize(18);
//     doc.text("Student Portfolio", 20, 20);

//     // Profile
//     doc.setFontSize(14);
//     doc.text("Profile", 20, 35);
//     doc.setFontSize(12);
//     doc.text(`Name: ${portfolio.profile.name}`, 20, 45);
//     doc.text(`Email: ${portfolio.profile.email}`, 20, 55);
//     doc.text(`Bio: ${portfolio.profile.bio}`, 20, 65);
//     doc.text(`Contact: ${portfolio.profile.contact}`, 20, 75);

//     // Education
//     doc.setFontSize(14);
//     doc.text("Education", 20, 95);
//     doc.setFontSize(12);
//     portfolio.education.forEach((edu, i) => {
//       doc.text(
//         `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.start_year} - ${edu.end_year})`,
//         20,
//         105 + i * 10
//       );
//     });

//     // Skills
//     doc.setFontSize(14);
//     doc.text("Skills", 20, 135);
//     doc.setFontSize(12);
//     portfolio.skills.forEach((skill, i) => {
//       doc.text(`${skill.skill_name} (${skill.level})`, 20, 145 + i * 10);
//     });

//     // Projects
//     doc.setFontSize(14);
//     doc.text("Projects", 20, 175);
//     doc.setFontSize(12);
//     portfolio.projects.forEach((proj, i) => {
//       doc.text(`${proj.title} - ${proj.description}`, 20, 185 + i * 10);
//     });

//     doc.save("portfolio.pdf");
//   };

//   if (loading) return <p className="text-center mt-10">Loading portfolio...</p>;
//   if (!portfolio) return <p className="text-center mt-10 text-red-500">No portfolio data found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       {/* Header */}
//       <h1 className="text-3xl font-bold text-center mb-6">My Portfolio</h1>

//       {/* Profile */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Profile</h2>
//         <p><strong>Name:</strong> {portfolio.profile.name}</p>
//         <p><strong>Email:</strong> {portfolio.profile.email}</p>
//         <p><strong>Bio:</strong> {portfolio.profile.bio}</p>
//         <p><strong>Contact:</strong> {portfolio.profile.contact}</p>
//       </div>

//       {/* Education */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Education</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.education.map((edu, idx) => (
//             <li key={idx}>
//               {edu.degree} in {edu.field} - {edu.institution} ({edu.start_year} - {edu.end_year})
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Skills */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Skills</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.skills.map((skill, idx) => (
//             <li key={idx}>{skill.skill_name} ({skill.level})</li>
//           ))}
//         </ul>
//       </div>

//       {/* Projects */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Projects</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.projects.map((proj, idx) => (
//             <li key={idx}>
//               <strong>{proj.title}</strong>: {proj.description}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Download Button */}
//       <div className="text-center">
//         <button
//           onClick={handleDownload}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition"
//         >
//           Download Portfolio as PDF
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Portfolio;

// import React, { useEffect, useState } from "react";
// import API from "../services/api";
// import jsPDF from "jspdf";

// function Portfolio() {
//   const [portfolio, setPortfolio] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     const fetchPortfolio = async () => {
//       try {
//         const res = await API.get("/students/portfolio/me");
//         setPortfolio(res.data);
//       } catch (err) {
//         console.error("Error fetching portfolio:", err.response || err);
//         setError("Failed to load portfolio data");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchPortfolio();
//   }, []);

//   const handleDownload = () => {
//     if (!portfolio) return;

//     const doc = new jsPDF();
//     let y = 20;

//     doc.setFontSize(18);
//     doc.text("My Portfolio", 20, y);

//     y += 15;
//     doc.setFontSize(14);
//     doc.text("Profile", 20, y);

//     y += 10;
//     doc.setFontSize(12);
//     doc.text(`Name: ${portfolio.profile.name}`, 20, y);
//     y += 8;
//     doc.text(`Email: ${portfolio.profile.email}`, 20, y);
//     y += 8;
//     doc.text(`Bio: ${portfolio.profile.bio || "N/A"}`, 20, y);
//     y += 8;
//     doc.text(`Contact: ${portfolio.profile.contact || "N/A"}`, 20, y);

//     // Education
//     y += 12;
//     doc.setFontSize(14);
//     doc.text("Education", 20, y);
//     y += 8;
//     doc.setFontSize(12);
//     portfolio.education.forEach((edu) => {
//       doc.text(
//         `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.start_year}-${edu.end_year}) - ${edu.percentage || "N/A"}%`,
//         20,
//         y
//       );
//       y += 8;
//     });

//     // Skills
//     y += 4;
//     doc.setFontSize(14);
//     doc.text("Skills", 20, y);
//     y += 8;
//     doc.setFontSize(12);
//     portfolio.skills.forEach((skill) => {
//       doc.text(`${skill.skill_name} (${skill.level || "N/A"})`, 20, y);
//       y += 8;
//     });

//     // Projects
//     y += 4;
//     doc.setFontSize(14);
//     doc.text("Projects", 20, y);
//     y += 8;
//     doc.setFontSize(12);
//     portfolio.projects.forEach((proj) => {
//       doc.text(`${proj.title} - ${proj.description}`, 20, y);
//       y += 8;
//     });

//     doc.save("portfolio.pdf");
//   };

//   if (loading) return <p className="text-center mt-10">Loading portfolio...</p>;
//   if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
//   if (!portfolio) return <p className="text-center mt-10">No portfolio data found.</p>;

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">My Portfolio</h1>

//       {/* Profile */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Profile</h2>
//         <p><strong>Name:</strong> {portfolio.profile.name}</p>
//         <p><strong>Email:</strong> {portfolio.profile.email}</p>
//         <p><strong>Bio:</strong> {portfolio.profile.bio || "N/A"}</p>
//         <p><strong>Contact:</strong> {portfolio.profile.contact || "N/A"}</p>
//       </div>

//       {/* Education */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Education</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.education.map((edu, idx) => (
//             <li key={idx}>
//               {edu.degree} in {edu.field} - {edu.institution} ({edu.start_year}-{edu.end_year}) - {edu.percentage || "N/A"}%
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Skills */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Skills</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.skills.map((skill, idx) => (
//             <li key={idx}>{skill.skill_name} ({skill.level || "N/A"})</li>
//           ))}
//         </ul>
//       </div>

//       {/* Projects */}
//       <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
//         <h2 className="text-xl font-semibold mb-2">Projects</h2>
//         <ul className="list-disc pl-5">
//           {portfolio.projects.map((proj, idx) => (
//             <li key={idx}>
//               <strong>{proj.title}</strong>: {proj.description}
//             </li>
//           ))}
//         </ul>
//       </div>

//       <div className="text-center">
//         <button
//           onClick={handleDownload}
//           className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition"
//         >
//           Download Portfolio as PDF
//         </button>
//       </div>
//     </div>
//   );
// }

// export default Portfolio;



import React, { useEffect, useState } from "react";
import API from "../services/api";
import jsPDF from "jspdf";

function Portfolio() {
  const [portfolio, setPortfolio] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const res = await API.get("/students/portfolio/me");
        setPortfolio(res.data);
      } catch (err) {
        console.error("Error fetching portfolio:", err.response || err);
        setError("Failed to load portfolio data");
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const handleDownload = () => {
    if (!portfolio) return;

    const doc = new jsPDF();
    let y = 20;

    // Title
    doc.setFontSize(18);
    doc.text("My Portfolio", 20, y);

    // Profile
    y += 15;
    doc.setFontSize(14);
    doc.text("Profile", 20, y);
    y += 8;
    doc.setFontSize(12);
    doc.text(`Name: ${portfolio.profile.name}`, 20, y);
    y += 8;
    doc.text(`Email: ${portfolio.profile.email}`, 20, y);
    y += 8;
    doc.text(`Bio: ${portfolio.profile.bio || "N/A"}`, 20, y);
    y += 8;
    doc.text(`Contact: ${portfolio.profile.contact || "N/A"}`, 20, y);

    // Education
    y += 12;
    doc.setFontSize(14);
    doc.text("Education", 20, y);
    y += 8;
    doc.setFontSize(12);
    portfolio.education.forEach((edu) => {
      doc.text(
        `${edu.degree} in ${edu.field} - ${edu.institution} (${edu.start_year}-${edu.end_year}) - ${edu.percentage || "N/A"}%`,
        20,
        y
      );
      y += 8;
    });

    // Skills
    y += 4;
    doc.setFontSize(14);
    doc.text("Skills", 20, y);
    y += 8;
    doc.setFontSize(12);
    portfolio.skills.forEach((skill) => {
      doc.text(`${skill.skill_name} (${skill.level || "N/A"})`, 20, y);
      y += 8;
    });

    // Projects
    y += 4;
    doc.setFontSize(14);
    doc.text("Projects", 20, y);
    y += 8;
    doc.setFontSize(12);
    portfolio.projects.forEach((proj) => {
      doc.text(`${proj.title} - ${proj.description}`, 20, y);
      y += 8;
      if (proj.link) {
        doc.text(`Link: ${proj.link}`, 20, y);
        y += 8;
      }
      doc.text(`Tech Stack: ${proj.tech_stack || "N/A"}`, 20, y);
      y += 8;
    });

    doc.save("portfolio.pdf");
  };

  if (loading) return <p className="text-center mt-10">Loading portfolio...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!portfolio) return <p className="text-center mt-10">No portfolio data found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">My Portfolio</h1>

      {/* Profile */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Profile</h2>
        <p><strong>Name:</strong> {portfolio.profile.name}</p>
        <p><strong>Email:</strong> {portfolio.profile.email}</p>
        <p><strong>Bio:</strong> {portfolio.profile.bio || "N/A"}</p>
        <p><strong>Contact:</strong> {portfolio.profile.contact || "N/A"}</p>
      </div>

      {/* Education */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Education</h2>
        <ul className="list-disc pl-5">
          {portfolio.education.map((edu, idx) => (
            <li key={idx}>
              {edu.degree} in {edu.field} - {edu.institution} ({edu.start_year}-{edu.end_year}) - {edu.percentage || "N/A"}%
            </li>
          ))}
        </ul>
      </div>

      {/* Skills */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Skills</h2>
        <ul className="list-disc pl-5">
          {portfolio.skills.map((skill, idx) => (
            <li key={idx}>{skill.skill_name} ({skill.level || "N/A"})</li>
          ))}
        </ul>
      </div>

      {/* Projects */}
      <div className="bg-white shadow-md rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">Projects</h2>
        <ul className="list-disc pl-5">
          {portfolio.projects.map((proj, idx) => (
            <li key={idx}>
              <strong>{proj.title}</strong>: {proj.description}
              {proj.link && (
                <a
                  href={proj.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline ml-2"
                >
                  Link
                </a>
              )}
              <p>Tech Stack: {proj.tech_stack || "N/A"}</p>
            </li>
          ))}
        </ul>
      </div>

      {/* Download Button */}
      <div className="text-center">
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-md transition"
        >
          Download Portfolio as PDF
        </button>
      </div>
    </div>
  );
}

export default Portfolio;
