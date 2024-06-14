import React, { useState } from 'react';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import '../styles/ExercisePage.css';

const ExercisePage = () => {
  const [videos, setVideos] = useState([
    { thumbnail: 'YOUTUBE VIDEO THUMBNAIL', title: 'YOUTUBE VIDEO TITLE 1' },
    { thumbnail: 'YOUTUBE VIDEO THUMBNAIL', title: 'YOUTUBE VIDEO TITLE 2' },
    { thumbnail: 'YOUTUBE VIDEO THUMBNAIL', title: 'YOUTUBE VIDEO TITLE 3' },
  ]);

  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const filteredVideos = videos.filter(video =>
      video.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setVideos(filteredVideos);
  };

  const handleInputChange = (event) => {
    setSearchTerm(event.target.value);
  };

  return (
    <div className="exercise-page">
      <div className="exercise-schedule">
        <h2>Exercise Schedule</h2>
        <div className="schedule-box"></div>
      </div>

      <div className="exercise-search">
        <h2>Exercises</h2>
        <div className="search-container">
          <div className="search-bar-container">
            <input
              type="text"
              className="search-bar"
              placeholder="Search"
              value={searchTerm}
              onChange={handleInputChange}
            />
            <SearchOutlinedIcon className="search-icon" onClick={handleSearch} />
          </div>
        </div>
      </div>

      <div className="exercise-videos">
        {videos.map((video, index) => (
          <div className="video-box" key={index}>
            <div className="video-thumbnail">
              <img src={video.thumbnail} alt="Video Thumbnail" />
            </div>
            <div className="video-title">{video.title}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExercisePage;
