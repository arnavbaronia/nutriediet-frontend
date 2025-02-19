// import React, { useState, useEffect } from "react";
// import { Form, Button } from "react-bootstrap";
// import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import "../../styles/DietTemplatesPage.css";

// const DietTemplatesPage = () => {
//   const [dietTemplates, setDietTemplates] = useState([]);
//   const [selectedDietTemplate, setSelectedDietTemplate] = useState(null);
//   const [error, setError] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const token = localStorage.getItem("token");

//   const api = axios.create({
//     baseURL: "http://localhost:8081",
//     headers: { Authorization: `Bearer ${token}` },
//   });

//   // Fetch all diet templates
//   const fetchDietTemplates = async () => {
//     try {
//       const response = await api.get("/admin/diet_templates");
//       setDietTemplates(response.data.list || []);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch diet templates. Please try again.");
//     }
//   };

//   // Fetch a specific diet template by ID
//   const fetchDietTemplateByID = async (dietTemplateID) => {
//     if (!dietTemplateID) return;
//     setLoading(true);
//     try {
//       const response = await api.get(`/admin/diet_templates/${dietTemplateID}`);
//       setSelectedDietTemplate(response.data);
//       setError(null);
//     } catch (err) {
//       setError("Failed to fetch diet template details.");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchDietTemplates();
//   }, []);

//   return (
//     <div className="diet-templates-page">
//       <div className="top-section">
//         <h1 className="page-title">Diet Templates</h1>
//         <div className="header-section">
//           <Form.Group controlId="templateSelect" className="template-select">
//             <Form.Control
//               as="select"
//               onChange={(e) => fetchDietTemplateByID(e.target.value)}
//               className="custom-dropdown"
//             >
//               <option value="">-- Select a Diet Template --</option>
//               {dietTemplates.map((template) => (
//                 <option key={template.ID} value={template.ID}>
//                   {template.Name}
//                 </option>
//               ))}
//             </Form.Control>
//           </Form.Group>
//           <div className="action-buttons">
//             <Button onClick={() => navigate("/admin/diet_templates/new")} className="btn-create">
//               <FaPlusCircle /> Create
//             </Button>
//             <Button
//               onClick={() => navigate(`/admin/diet_templates/${selectedDietTemplate?.ID}`)}
//               disabled={!selectedDietTemplate}
//               className="btn-edit"
//             >
//               Edit
//             </Button>
//             <Button
//               onClick={() => alert("Delete functionality not implemented yet")}
//               disabled={!selectedDietTemplate}
//               className="btn-delete"
//             >
//               <FaTrashAlt /> Delete
//             </Button>
//           </div>
//         </div>
//       </div>

//       <div className="template-details">
//         {loading ? (
//           <p className="info-text">Loading...</p>
//         ) : selectedDietTemplate ? (
//           <div className="single-container">
//             <h2>{selectedDietTemplate.Name}</h2>
//             <p><strong>ID:</strong> {selectedDietTemplate.ID}</p>
//             <div className="diet-content">
//               <h3>Diet Plan</h3>
//               <p>{selectedDietTemplate.Diet}</p>
//             </div>
//           </div>
//         ) : (
//           <p className="info-text">Select a template to view details</p>
//         )}
//       </div>
//     </div>
//   );
// };

// export default DietTemplatesPage;

import React, { useState, useEffect } from "react";
import { Form, Button } from "react-bootstrap";
import { FaTrashAlt, FaPlusCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../../styles/DietTemplatesPage.css";

const DietTemplatesPage = () => {
  const [dietTemplates, setDietTemplates] = useState([]);
  const [selectedDietTemplate, setSelectedDietTemplate] = useState(null);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const api = axios.create({
    baseURL: "http://localhost:8081",
    headers: { Authorization: `Bearer ${token}` },
  });

  // Fetch diet templates
  const fetchDietTemplates = async () => {
    try {
      const response = await api.get("/admin/diet_templates");
      setDietTemplates(response.data.list || []);
      setError(null);
    } catch (err) {
      setError("Failed to fetch diet templates. Please try again.");
    }
  };

  useEffect(() => {
    fetchDietTemplates();
  }, []);

  // Handle delete diet template
  const handleDelete = async () => {
    if (!selectedDietTemplate) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete the diet template: "${selectedDietTemplate.Name}"?`
    );

    if (!confirmDelete) return;

    try {
      await api.post(`/admin/diet_templates/${selectedDietTemplate.ID}/delete`);
      setDietTemplates(dietTemplates.filter(t => t.ID !== selectedDietTemplate.ID));
      setSelectedDietTemplate(null);
      alert("Diet template deleted successfully.");
    } catch (err) {
      alert("Failed to delete diet template. Please try again.");
    }
  };

  return (
    <div className="diet-templates-page">
      <div className="top-section">
        <h1 className="page-title">Diet Templates</h1>
        <div className="header-section">
          <Form.Group controlId="templateSelect" className="template-select">
            <Form.Control
              as="select"
              onChange={(e) => {
                const selectedId = parseInt(e.target.value);
                const selectedTemplate = dietTemplates.find(t => t.ID === selectedId);
                setSelectedDietTemplate(selectedTemplate || null);
              }}
              className="custom-dropdown"
            >
              <option value="">-- Select a Diet Template --</option>
              {dietTemplates.map((template) => (
                <option key={template.ID} value={template.ID}>
                  {template.Name}
                </option>
              ))}
            </Form.Control>
          </Form.Group>
          <div className="action-buttons">
            <Button onClick={() => navigate("/admin/diet_templates/new")} className="btn-create">
              <FaPlusCircle /> Create
            </Button>
            <Button
              onClick={() => navigate(`/admin/diet_templates/${selectedDietTemplate?.ID}`)}
              disabled={!selectedDietTemplate}
              className="btn-edit"
            >
              Edit
            </Button>
            <Button
              onClick={handleDelete}
              disabled={!selectedDietTemplate}
              className="btn-delete"
            >
              <FaTrashAlt /> Delete
            </Button>
          </div>
        </div>
      </div>

      <div className="template-details">
        {selectedDietTemplate ? (
          <div className="single-container">
            <h2>{selectedDietTemplate.Name}</h2>
            <p><strong>ID:</strong> {selectedDietTemplate.ID}</p>
          </div>
        ) : (
          <p className="info-text">Select a template to view details</p>
        )}
      </div>
    </div>
  );
};

export default DietTemplatesPage;
