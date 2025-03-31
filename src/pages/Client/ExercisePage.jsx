import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ExercisePage.css";
import { getToken } from "../../auth/token";
import { FaRunning, FaSearch } from "react-icons/fa";

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
        `https://nutriediet-go.onrender.com/clients/${clientId}/exercise`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

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

        setExercises(formattedExercises);
        setFilteredExercises(formattedExercises);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    setFilteredExercises(
      query ? exercises.filter((e) => e.title.toLowerCase().includes(query)) : exercises
    );
  };

  return (
    <div className="exercise-page">
      <div className="page-header">
        <h1 className="exercise-title">
          <FaRunning className="title-icon" /> Exercises
        </h1>
        <div className="search-container">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="exercise-search"
            placeholder="Search for an exercise..."
            value={searchTerm}
            onChange={handleSearch}
          />
        </div>
      </div>

      <div className="exercise-videos-container">
        <div className="exercise-videos-grid">
          {filteredExercises.length > 0 ? (
            filteredExercises.map((exercise) => (
              <div key={exercise.id} className="video-card">
                <div className="thumbnail-container">
                  <img 
                    src={exercise.thumbnail} 
                    alt={exercise.title} 
                    className="thumbnail"
                  />
                </div>
                
                <div className="card-footer">
                  <h3 className="video-title">{exercise.title}</h3>
                  <div className="button-container">
                    <a
                      href={exercise.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="watch-button"
                    >
                      Watch Video
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="no-results">No exercises found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExercisePage;