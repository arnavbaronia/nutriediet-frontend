import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../styles/ExercisePage.css";
import { getToken } from "../../auth/token";
import { FaRunning, FaSearch, FaStar, FaRegStar } from "react-icons/fa";

const ExercisePage = () => {
  const [exercises, setExercises] = useState([]);
  const [filteredExercises, setFilteredExercises] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFavorites, setShowFavorites] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    setLoading(true);
    const token = getToken();
    const clientId = localStorage.getItem("client_id");

    if (!token || !clientId) {
      console.error("Missing authentication details.");
      setLoading(false);
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
            description: exercise.description || "",
            video_url: exercise.link || "#",
            thumbnail: videoId
              ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
              : "https://via.placeholder.com/300",
            isFavorite: exercise.is_favorite || false,
          };
        });

        setExercises(formattedExercises);
        setFilteredExercises(formattedExercises);
      }
    } catch (error) {
      console.error("Error fetching exercises:", error);
    } finally {
      setLoading(false);
    }
  };

  const extractYouTubeID = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  const handleSearch = (event) => {
    const query = event.target.value.toLowerCase();
    setSearchTerm(query);
    filterExercises(query, showFavorites);
  };

  const toggleFavorite = async (exerciseId, isCurrentlyFavorite) => {
    // Optimistic update
    const updatedExercises = exercises.map((exercise) => {
      if (exercise.id === exerciseId) {
        return { ...exercise, isFavorite: !isCurrentlyFavorite };
      }
      return exercise;
    });

    setExercises(updatedExercises);
    filterExercises(searchTerm, showFavorites);

    // API call
    const token = getToken();
    const clientId = localStorage.getItem("client_id");

    try {
      await axios.post(
        `https://nutriediet-go.onrender.com/clients/${clientId}/exercise/favorite`,
        {
          exercise_id: exerciseId,
          is_favorite: !isCurrentlyFavorite,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert on error
      const revertedExercises = exercises.map((exercise) => {
        if (exercise.id === exerciseId) {
          return { ...exercise, isFavorite: isCurrentlyFavorite };
        }
        return exercise;
      });
      setExercises(revertedExercises);
      filterExercises(searchTerm, showFavorites);
    }
  };

  const toggleShowFavorites = () => {
    const newShowFavorites = !showFavorites;
    setShowFavorites(newShowFavorites);
    filterExercises(searchTerm, newShowFavorites);
  };

  const filterExercises = (query, favoritesOnly) => {
    let result = exercises;
    
    if (query) {
      result = result.filter((e) => e.title.toLowerCase().includes(query));
    }
    
    if (favoritesOnly) {
      result = result.filter((e) => e.isFavorite);
    }
    
    setFilteredExercises(result);
  };

  return (
    <div className="exercise-page">
      <div className="page-header">
        <h1 className="exercise-title">
          <FaRunning className="title-icon" /> Exercises
        </h1>
        <div className="header-controls">
          <div className="search-container3">
            <FaSearch className="search-icon" />
            <input
              type="text"
              className="exercise-search"
              placeholder="Search for an exercise..."
              value={searchTerm}
              onChange={handleSearch}
            />
          </div>
          <button
            className={`favorites-toggle ${showFavorites ? "active" : ""}`}
            onClick={toggleShowFavorites}
          >
            {showFavorites ? <FaStar /> : <FaRegStar />}
            {showFavorites ? "Show All Exercises" : "Show Favorites"}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loading-message">Loading exercises...</div>
      ) : (
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
                    <button
                      className={`favorite-button ${exercise.isFavorite ? "favorited" : ""}`}
                      onClick={() => toggleFavorite(exercise.id, exercise.isFavorite)}
                    >
                      {exercise.isFavorite ? <FaStar /> : <FaRegStar />}
                    </button>
                  </div>
                  
                  <div className="card-footer">
                    <h3 className="video-title">{exercise.title}</h3>
                    {exercise.description && (
                      <p className="exercise-description">{exercise.description}</p>
                    )}
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
              <p className="no-results">
                {showFavorites 
                  ? "You haven't marked any exercises as favorites yet." 
                  : "No exercises found"}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ExercisePage;