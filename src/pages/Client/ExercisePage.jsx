import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ExercisePage.css";
import { getToken } from "../../auth/token";

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    const token = getToken();
    const clientId = localStorage.getItem("client_id");

    if (!token || !clientId) {
      console.error("Missing authentication details.");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8081/clients/${clientId}/exercise`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      console.log("API Response:", response.data);

      if (response.data && response.data.exercises) {
        const formattedExercises = response.data.exercises.map((exercise) => {
          const videoId = extractYouTubeID(exercise.link);
          return {
            id: exercise.id,
            title: exercise.name || "Unknown Title",
            video_url: exercise.link || "#",
            thumbnail: videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "https://via.placeholder.com/300",
          };
        });

        console.log("Formatted Exercises:", formattedExercises);
        setExercises(formattedExercises);
        setFilteredExercises(formattedExercises);
      } else {
        console.error("Unexpected API Response Format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    
    let match;
    
    match = url.match(/embed\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    match = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    match = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    return null;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);

    if (!query) {
      setFilteredExercises(exercises);
    } else {
      const filtered = exercises.filter((exercise) =>
        exercise.title.toLowerCase().includes(query)
      );
      setFilteredExercises(filtered);
    }
  };

  return (
    <div className="exercise-page">
      <h1 className="exercise-title">Exercises</h1>
      <input
        type="text"
        className="exercise-search"
        placeholder="Search for an exercise..."
        value={searchTerm}
        onChange={handleSearch}
      />

      <div
        className="exercise-videos"
        style={{ justifyContent: filteredExercises.length === 1 ? "center" : "flex-start" }}
      >
        {filteredExercises.length > 0 ? (
          filteredExercises.map((exercise) => (
            <div key={exercise.id} className="video-box">
              <div className="video-thumbnail">
                <img src={exercise.thumbnail} alt={exercise.title} />
              </div>
              <div className="video-title">{exercise.title}</div>
              <a href={exercise.video_url} target="_blank" rel="noopener noreferrer">
                Watch Video
              </a>
            </div>
          ))
        ) : (
          <p>No exercises found</p>
        )}
      </div>
    </div>
  );
};

export default ExercisePage;