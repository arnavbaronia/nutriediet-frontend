import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "../../styles/WeightUpdatePage.css";

const WeightUpdatePage = () => {
  const { client_id } = useParams();
  const [weight, setWeight] = useState("");
  const [feedback, setFeedback] = useState("");
  const [isAllowed, setIsAllowed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    checkWeightUpdateStatus();
  }, []);

  const checkWeightUpdateStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("❌ Authentication failed. Please log in again.");
        return;
      }

      const response = await axios.get(
        `https://nutriediet-go-production.up.railway.app/clients/${client_id}/weight_update`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200 && response.data.isActive) {
        setIsAllowed(response.data.status === "allowed");
      } else {
        setIsAllowed(false);
      }
    } catch (error) {
      console.error("Error fetching weight update status:", error);
      setErrorMessage(
        "⚠️ Unable to fetch weight update status. Please try again later."
      );
    }
  };

  const handleWeightUpdate = async () => {
    if (!weight || isNaN(weight) || parseFloat(weight) <= 0) {
      setErrorMessage("⚠️ Please enter a valid weight.");
      return;
    }

    if (!feedback.trim()) {
      setErrorMessage("⚠️ Please provide feedback.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setErrorMessage("❌ Authentication failed. Please log in again.");
        return;
      }

      const requestData = {
        weight: parseFloat(weight),
        feedback: feedback.trim(),
      };

      console.log("Sending request data:", requestData);

      await axios.post(
        `https://nutriediet-go-production.up.railway.app/clients/${client_id}/weight_update`,
        requestData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setShowPopup(true);
      setWeight("");
      setFeedback("");
      checkWeightUpdateStatus();
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
        {errorMessage && <p className="error-text">{errorMessage}</p>}

        {isAllowed ? (
          <>
            {/* Weight Input */}
            <input
              type="number"
              placeholder="Enter your weight (kg)"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="weight-input"
            />

            {/* Feedback Input */}
            <textarea
              placeholder="Enter feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="feedback1-input"
              rows="4"
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
          <p className="error-text">
            ⏳ Weight update is allowed only after 4 days.
          </p>
        )}
      </div>

      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <h3>Success! 🎉</h3>
            <p>
              Your weight and feedback have been successfully updated. Keep
              going strong! 💪
            </p>
            <button
              onClick={() => setShowPopup(false)}
              className="close-button"
            >
              Got it!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WeightUpdatePage;