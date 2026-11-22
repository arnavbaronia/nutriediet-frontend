import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axiosInstance';
import { API_ENDPOINTS, ROUTES } from '../../utils/constants';
import logger from '../../utils/logger';
import '../../styles/WaitingRoomControlPage.css';

const WaitingRoomControlPage = () => {
  const [state, setState] = useState(null);
  const [customMessage, setCustomMessage] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [loading, setLoading] = useState('');
  const [error, setError] = useState('');

  const fetchState = async () => {
    try {
      const response = await api.get(API_ENDPOINTS.DISPLAY_STATUS);
      const next = response.data.state;
      setState(next);
      if (next?.status === 'custom' && next.message) {
        setCustomMessage(next.message);
      }
      setError('');
    } catch (err) {
      logger.error('Failed to load display status', err);
      setError(err.response?.data?.error || 'Failed to load display status');
    }
  };

  useEffect(() => {
    fetchState();
  }, []);

  const postStatus = async (payload, actionKey) => {
    setLoading(actionKey);
    setError('');
    try {
      const response = await api.post(API_ENDPOINTS.DISPLAY_STATUS, payload);
      setState(response.data.state);
    } catch (err) {
      logger.error('Failed to update display status', err);
      setError(err.response?.data?.error || 'Failed to update display');
    } finally {
      setLoading('');
    }
  };

  const setPreset = (status) => {
    setShowCustomInput(false);
    postStatus({ status }, status);
  };

  const submitCustom = (event) => {
    event.preventDefault();
    const message = customMessage.trim();
    if (!message) {
      setError('Enter a custom message');
      return;
    }
    postStatus({ status: 'custom', message }, 'custom');
  };

  const toggleAnnouncements = () => {
    const next = !(state?.announcementsEnabled);
    postStatus({ announcementsEnabled: next }, 'announce');
  };

  return (
    <div className="waiting-room-control">
      <header className="waiting-room-control__header">
        <h1>Waiting Room Control</h1>
        <p>Tap a button to update the clinic display instantly.</p>
        <Link className="waiting-room-control__preview-link" to={ROUTES.ADMIN_DISPLAY}>
          Open waiting-room display →
        </Link>
      </header>

      <div className="waiting-room-control__current">
        <span className="waiting-room-control__label">Now showing</span>
        <strong>{state?.title || '—'}</strong>
        <span>{state?.message || 'Loading…'}</span>
      </div>

      {error && <p className="waiting-room-control__error">{error}</p>}

      <div className="waiting-room-control__buttons">
        <button
          type="button"
          className={`waiting-room-control__btn waiting-room-control__btn--primary ${state?.status === 'next_patient' ? 'is-active' : ''}`}
          disabled={!!loading}
          onClick={() => setPreset('next_patient')}
        >
          {loading === 'next_patient' ? 'Updating…' : 'NEXT PATIENT'}
        </button>

        <button
          type="button"
          className={`waiting-room-control__btn ${state?.status === 'please_wait' ? 'is-active' : ''}`}
          disabled={!!loading}
          onClick={() => setPreset('please_wait')}
        >
          {loading === 'please_wait' ? 'Updating…' : 'PLEASE WAIT'}
        </button>

        <button
          type="button"
          className={`waiting-room-control__btn ${state?.status === 'custom' ? 'is-active' : ''}`}
          disabled={!!loading}
          onClick={() => setShowCustomInput((open) => !open)}
        >
          CUSTOM MESSAGE
        </button>

        <button
          type="button"
          className={`waiting-room-control__btn waiting-room-control__btn--announce ${state?.announcementsEnabled ? 'is-on' : ''}`}
          disabled={!!loading}
          onClick={toggleAnnouncements}
        >
          {loading === 'announce'
            ? 'Updating…'
            : state?.announcementsEnabled
              ? '🔊 ANNOUNCEMENTS ON'
              : '🔇 ANNOUNCEMENTS OFF'}
        </button>
      </div>

      {showCustomInput && (
        <form className="waiting-room-control__custom" onSubmit={submitCustom}>
          <label htmlFor="custom-message">Message shown on the display</label>
          <textarea
            id="custom-message"
            rows={3}
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            placeholder="The doctor will be available shortly."
          />
          <button type="submit" disabled={!!loading}>
            {loading === 'custom' ? 'Sending…' : 'Send custom message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default WaitingRoomControlPage;
