// src/pages/Skills.js
import React, { useEffect, useState } from "react";
import { authGet, authPost, authDelete, authPut } from "../services/api";

function Skills() {
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({ skill_name: "", level: "" });
  const [error, setError] = useState("");
  const [editingSkillId, setEditingSkillId] = useState(null);

  // Fetch all skills for logged-in user
  const fetchSkills = async () => {
    try {
      const res = await authGet("/skills");
      setSkills(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch skills.");
      console.error(err.response || err);
    }
  };

  useEffect(() => {
    fetchSkills();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle adding or updating a skill
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.skill_name) {
      setError("Skill name is required.");
      return;
    }

    try {
      if (editingSkillId) {
        // Update existing skill
        await authPut(`/skills/${editingSkillId}`, form);
        setSkills(
          skills.map((skill) =>
            skill.id === editingSkillId ? { ...skill, ...form } : skill
          )
        );
        setEditingSkillId(null);
      } else {
        // Add new skill
        const res = await authPost("/skills", form);
        setSkills([...skills, res.data.skill]);
      }

      setForm({ skill_name: "", level: "" });
      setError("");
    } catch (err) {
      setError(editingSkillId ? "Failed to update skill." : "Failed to add skill.");
      console.error(err.response || err);
    }
  };

  // Handle deleting a skill
  const handleDelete = async (id) => {
    try {
      await authDelete(`/skills/${id}`);
      setSkills(skills.filter((skill) => skill.id !== id));
      setError("");
      if (editingSkillId === id) {
        setEditingSkillId(null);
        setForm({ skill_name: "", level: "" });
      }
    } catch (err) {
      setError("Failed to delete skill.");
      console.error(err.response || err);
    }
  };

  // Handle editing a skill
  const handleEdit = (skill) => {
    setForm({ skill_name: skill.skill_name, level: skill.level || "" });
    setEditingSkillId(skill.id);
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setForm({ skill_name: "", level: "" });
    setEditingSkillId(null);
    setError("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Skills</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <input
            type="text"
            name="skill_name"
            placeholder="Skill Name"
            value={form.skill_name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="level"
            placeholder="Level (optional)"
            value={form.level}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editingSkillId ? "Update Skill" : "Add Skill"}</button>
        {editingSkillId && (
          <button type="button" onClick={handleCancelEdit} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Skills</h3>
      {skills.length > 0 ? (
        <ul>
          {skills.map((skill) => (
            <li key={skill.id}>
              {skill.skill_name} {skill.level && `- ${skill.level}`}{" "}
              <button onClick={() => handleEdit(skill)}>Edit</button>{" "}
              <button onClick={() => handleDelete(skill.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No skills added yet.</p>
      )}
    </div>
  );
}

export default Skills;
