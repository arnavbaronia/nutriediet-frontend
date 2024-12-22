import React, { useEffect, useState } from "react";
import axios from "axios";

const DietPage = () => {
  const [diet, setDiet] = useState(null);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchDiet = async () => {
      const token = localStorage.getItem("token");
      const clientId = localStorage.getItem("clientId");
      const userType = localStorage.getItem("userType"); 
      console.log("Stored userType:", localStorage.getItem("userType"));
      console.log("Stored clientId:", localStorage.getItem("clientId"));
      if (!token || !clientId || userType !== "CLIENT") {
        setError("You must be logged in as a client to view this page.");
        localStorage.clear(); 
        window.location.href = "/login";
        return;
      }

      try {
        const response = await axios.get(`http://localhost:8081/clients/${clientId}/diet`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setDiet(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please log in again.");
          localStorage.clear();
          window.location.href = "/login";
        } else {
          setError("Failed to fetch diet. Please try again later.");
        }
      }
    };

    fetchDiet();
  }, []);

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  if (!diet) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Your Diet</h1>
      <pre>{JSON.stringify(diet, null, 2)}</pre>
    </div>
  );
};

export default DietPage;
