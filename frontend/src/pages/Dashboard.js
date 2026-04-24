import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authGet } from "../services/api";

function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [education, setEducation] = useState([]);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        // Fetch Profile
        const profileRes = await authGet("/students/me");
        setProfile(profileRes.data);

        // Fetch Education
        const eduRes = await authGet("/education");
        setEducation(Array.isArray(eduRes.data) ? eduRes.data : []);

        // Fetch Skills
        const skillsRes = await authGet("/skills");
        setSkills(Array.isArray(skillsRes.data) ? skillsRes.data : []);

        // Fetch Projects
        const projectsRes = await authGet("/projects");
        setProjects(Array.isArray(projectsRes.data) ? projectsRes.data : []);
      } catch (err) {
        setError("Failed to load data. Please login again.");
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    fetchData();
  }, [navigate]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!profile) return <p>Loading your dashboard...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {profile.name}</h2>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Bio:</strong> {profile.bio || "No bio added yet"}</p>
      <p><strong>Contact:</strong> {profile.contact || "Not provided"}</p>

      <h3>Education</h3>
      {education.length > 0 ? (
        <ul>
          {education.map((edu) => (
            <li key={edu.id}>
              {edu.degree} at {edu.institution} ({edu.year}) - {edu.percentage || "N/A"}%
            </li>
          ))}
        </ul>
      ) : (
        <p>No education records</p>
      )}

      <h3>Skills</h3>
      {skills.length > 0 ? (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id || skill.skill_name}>
              {skill.skill_name} - {skill.level}
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills added</p>
      )}

      <h3>Projects</h3>
{projects.length > 0 ? (
  <ul>
    {projects.map((project) => (
      <li key={project.id}>
        <strong>{project.title}</strong> - {project.description}{" "}
        {project.link && (
          <a href={project.link} target="_blank" rel="noreferrer">
            [Link]
          </a>
        )}
        {project.tech_stack && <span> | Tech: {project.tech_stack}</span>}
      </li>
    ))}
  </ul>
) : (
  <p>No projects found</p>
)}

    </div>
  );
}

export default Dashboard;
