import React, { useEffect, useState } from "react";
import { authGet, authPost, authDelete, authPut } from "../services/api";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ title: "", description: "", link: ""});
  const [editingId, setEditingId] = useState(null); // track which project is being edited
  const [error, setError] = useState("");

  const fetchProjects = async () => {
    try {
      const res = await authGet("/projects");
      setProjects(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch projects.");
      console.error(err.response || err);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description) {
      setError("Title and Description are required.");
      return;
    }

    try {
      if (editingId) {
        // Update existing project
        await authPut(`/projects/${editingId}`, form);
        setProjects(projects.map(p => p.id === editingId ? { ...p, ...form } : p));
        setEditingId(null);
      } else {
        // Add new project
        const res = await authPost("/projects", form);
        setProjects([...projects, res.data.project]);
      }
      setForm({ title: "", description: "", link: "" });
      setError("");
    } catch (err) {
      setError("Failed to save project.");
      console.error(err.response || err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await authDelete(`/projects/${id}`);
      setProjects(projects.filter(p => p.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete project.");
      console.error(err.response || err);
    }
  };

  const handleEdit = (project) => {
    setForm({ title: project.title, description: project.description, link: project.link || "" });
    setEditingId(project.id);
  };

  const handleCancel = () => {
    setForm({ title: "", description: "", link: ""});
    setEditingId(null);
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Projects</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          name="title"
          placeholder="Project Title"
          value={form.title}
          onChange={handleChange}
          required
        /><br />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        /><br />
        
        <input
          type="text"
          name="link"
          placeholder="Project Link (optional)"
          value={form.link}
          onChange={handleChange}
        /><br />
    
        <button type="submit">{editingId ? "Update Project" : "Add Project"}</button>
        {editingId && <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>Cancel</button>}
      </form>

      <h3>Existing Projects</h3>
      {projects.length > 0 ? (
        <ul>
          {projects.map(p => (
            <li key={p.id}>
              <strong>{p.title}</strong> - {p.description} {p.link && <a href={p.link} target="_blank" rel="noreferrer">[Link]</a>}
              <button onClick={() => handleEdit(p)} style={{ marginLeft: "10px" }}>Edit</button>
              <button onClick={() => handleDelete(p.id)} style={{ marginLeft: "5px" }}>Delete</button>
            </li>
          ))}
        </ul>
      ) : <p>No projects found</p>}
    </div>
  );
}

export default Projects;
