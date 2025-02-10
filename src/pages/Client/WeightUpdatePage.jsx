import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/WeightUpdatePage.css";

const WeightUpdatePage = () => {
  const [weight, setWeight] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [latestDietDate, setLatestDietDate] = useState("2025-01-01"); // Dummy date
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    fetchWeightUpdateStatus();
  }, []);

  const fetchWeightUpdateStatus = () => {
    const lastDietDate = new Date(latestDietDate);
    const currentDate = new Date();
    const daysSinceLastDiet = Math.floor(
      (currentDate - lastDietDate) / (1000 * 60 * 60 * 24)
    );

    setIsAllowed(daysSinceLastDiet >= 4);
  };

  const handleWeightUpdate = async () => {
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      setErrorMessage("⚠️ Please enter a valid weight.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      setTimeout(() => {
        console.log("Weight updated successfully:", weight);
        setShowPopup(true);
        setLoading(false);
      }, 1500);
    } catch (error) {
      setErrorMessage("❌ Failed to update weight. Try again later.");
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