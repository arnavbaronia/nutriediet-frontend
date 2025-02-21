import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/WeightUpdatePage.css";

const WeightUpdatePage = () => {
  const { client_id } = useParams();
  const [weight, setWeight] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [latestDietDate, setLatestDietDate] = useState("2025-02-10"); 
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchLatestDietDate();
  }, []);

  const fetchLatestDietDate = async () => {
    try {
      const response = await axios.get(`/admin/client/${client_id}/weight_history`); 

      if (response.status === 200 && response.data.length > 0) {
        const latestEntry = response.data[response.data.length - 1];
        setLatestDietDate(latestEntry.date);

        const lastDietDate = new Date(latestEntry.date);
        const currentDate = new Date();
        const daysSinceLastUpdate = Math.floor((currentDate - lastDietDate) / (1000 * 60 * 60 * 24));

        setIsAllowed(daysSinceLastUpdate >= 4);
      } else {
        throw new Error("No weight history found.");
      }
    } catch (error) {
      console.error("Error fetching weight history:", error);
      setErrorMessage("⚠️ Failed to load weight history. Using dummy data.");

      // Fallback dummy data for testing
      setLatestDietDate("2025-02-10");
      setIsAllowed(true);
    }
  };

  const handleWeightUpdate = async () => {
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      setErrorMessage("⚠️ Please enter a valid weight.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await axios.post(`/clients/${client_id}/weight_update`, {
        weight: parseFloat(weight),
        date: new Date().toISOString().split("T")[0],
      });

      setShowPopup(true);
      setWeight("");
      fetchLatestDietDate();
    } catch (error) {
      console.error("Error updating weight:", error);
      setErrorMessage("❌ Failed to update weight. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="weight-update-page">
      <h1 className="weight-title">Update Your Weight</h1>

      <div className="weight-container">
        <p>📅 Last Diet Given On: <strong>{latestDietDate}</strong></p>

        {errorMessage && <p className="error-text">{errorMessage}</p>}

        {isAllowed ? (
          <>
            <input
              type="number"
              placeholder="Enter your weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="weight-input"
            />
            <button
              onClick={handleWeightUpdate}
              disabled={loading}
              className="update-button"
            >
              {loading ? "Updating..." : "Update Weight"}
            </button>
          </>
        ) : (
          <p className="error-text">⏳ Weight update is allowed only after 4 days.</p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Success! 🎉</h3>
            <p>Your weight has been successfully updated. Keep going strong! 💪</p>
            <button onClick={() => setShowPopup(false)} className="close-button">
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightUpdatePage;