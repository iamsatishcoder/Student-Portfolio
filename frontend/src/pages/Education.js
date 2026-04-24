import React, { useEffect, useState } from "react";
import { authGet, authPost, authDelete, authPut } from "../services/api";

function Education() {
  const [education, setEducation] = useState([]);
  const [form, setForm] = useState({ degree: "", institution: "", year: "", percentage: "" });
  const [error, setError] = useState("");
  const [editId, setEditId] = useState(null); // currently editing education ID

  // Fetch all education records for logged-in user
  const fetchEducation = async () => {
    try {
      const res = await authGet("/education");
      setEducation(Array.isArray(res.data) ? res.data : []);
      setError("");
    } catch (err) {
      setError("Failed to fetch education data.");
      console.error(err.response || err);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Handle adding or updating education
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { degree, institution, year, percentage } = form;

    if (!degree || !institution || !year) {
      setError("Degree, Institution, and Year are required.");
      return;
    }

    try {
      if (editId) {
        // Update existing record
        await authPut(`/education/${editId}`, form);
        setEducation(
          education.map((edu) =>
            edu.id === editId ? { ...edu, degree, institution, year, percentage } : edu
          )
        );
        setEditId(null);
      } else {
        // Add new record
        const res = await authPost("/education", form);
        setEducation([...education, res.data.education]);
      }

      setForm({ degree: "", institution: "", year: "", percentage: "" });
      setError("");
    } catch (err) {
      setError("Failed to save education record.");
      console.error(err.response || err);
    }
  };

  // Handle deleting an education record
  const handleDelete = async (id) => {
    try {
      await authDelete(`/education/${id}`);
      setEducation(education.filter((edu) => edu.id !== id));
      setError("");
    } catch (err) {
      setError("Failed to delete education record.");
      console.error(err.response || err);
    }
  };

  // Handle editing a record
  const handleEdit = (edu) => {
    setForm({
      degree: edu.degree,
      institution: edu.institution,
      year: edu.year,
      percentage: edu.percentage || "",
    });
    setEditId(edu.id);
  };

  // Handle cancel edit
  const handleCancel = () => {
    setForm({ degree: "", institution: "", year: "", percentage: "" });
    setEditId(null);
    setError("");
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Education</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <div>
          <input
            type="text"
            name="degree"
            placeholder="Degree"
            value={form.degree}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="institution"
            placeholder="Institution"
            value={form.institution}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="year"
            placeholder="Year"
            value={form.year}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            name="percentage"
            placeholder="Percentage / CGPA"
            value={form.percentage}
            onChange={handleChange}
          />
        </div>
        <button type="submit">{editId ? "Update Education" : "Add Education"}</button>
        {editId && (
          <button type="button" onClick={handleCancel} style={{ marginLeft: "10px" }}>
            Cancel
          </button>
        )}
      </form>

      <h3>Existing Education Records</h3>
      {education.length > 0 ? (
        <ul>
          {education.map((edu) => (
            <li key={edu.id}>
              {edu.degree} at {edu.institution} ({edu.year}) - {edu.percentage || "N/A"}{" "}
              <button onClick={() => handleEdit(edu)}>Edit</button>{" "}
              <button onClick={() => handleDelete(edu.id)}>Delete</button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No education records found.</p>
      )}
    </div>
  );
}

export default Education;
