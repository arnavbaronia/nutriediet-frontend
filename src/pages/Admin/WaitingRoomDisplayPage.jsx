import React, { useCallback, useEffect, useRef, useState } from 'react';
import { API_BASE_URL, STORAGE_KEYS } from '../../utils/constants';
import '../../styles/WaitingRoomDisplayPage.css';

const RECONNECT_MS = 2000;

const WaitingRoomDisplayPage = () => {
  const [state, setState] = useState(null);
  const [connection, setConnection] = useState('connecting');
  const [speechUnlocked, setSpeechUnlocked] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);

  const speechUnlockedRef = useRef(false);
  const lastSpokenKeyRef = useRef('');
  const reconnectTimerRef = useRef(null);
  const sourceRef = useRef(null);

  const speakIfNeeded = useCallback((nextState, isInitialSnapshot) => {
    if (
      !nextState ||
      isInitialSnapshot ||
      !speechUnlockedRef.current ||
      !nextState.announcementsEnabled
    ) {
      return;
    }
    if (!('speechSynthesis' in window) || !nextState.spokenText) {
      return;
    }

    const key = `${nextState.updatedAt}|${nextState.spokenText}`;
    if (key === lastSpokenKeyRef.current) {
      return;
    }
    lastSpokenKeyRef.current = key;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(nextState.spokenText);
    utterance.rate = 0.95;
    utterance.pitch = 1;
    window.speechSynthesis.speak(utterance);
  }, []);

  const applyState = useCallback((nextState, isInitialSnapshot) => {
    setState(nextState);
    speakIfNeeded(nextState, isInitialSnapshot);
  }, [speakIfNeeded]);

  const connect = useCallback(() => {
    if (sourceRef.current) {
      sourceRef.current.close();
      sourceRef.current = null;
    }

    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!token) {
      setSessionExpired(true);
      setConnection('error');
      return;
    }

    setConnection('connecting');
    const url = `${API_BASE_URL}/display/stream?token=${encodeURIComponent(token)}`;
    const source = new EventSource(url);
    sourceRef.current = source;
    let receivedSnapshot = false;

    source.onopen = () => {
      setConnection('live');
      setSessionExpired(false);
    };

    source.onmessage = (event) => {
      try {
        const nextState = JSON.parse(event.data);
        const isInitialSnapshot = !receivedSnapshot;
        receivedSnapshot = true;
        applyState(nextState, isInitialSnapshot);
      } catch (err) {
        // Ignore malformed keepalive/payloads.
      }
    };

    source.onerror = () => {
      source.close();
      sourceRef.current = null;
      setConnection('reconnecting');

      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      reconnectTimerRef.current = setTimeout(connect, RECONNECT_MS);
    };
  }, [applyState]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectTimerRef.current) {
        clearTimeout(reconnectTimerRef.current);
      }
      if (sourceRef.current) {
        sourceRef.current.close();
      }
    };
  }, [connect]);

  const enableAnnouncements = () => {
    speechUnlockedRef.current = true;
    setSpeechUnlocked(true);
    if ('speechSynthesis' in window) {
      const priming = new SpeechSynthesisUtterance('Announcements enabled');
      priming.volume = 0.01;
      window.speechSynthesis.speak(priming);
    }
  };

  const title = state?.title || 'PLEASE WAIT';
  const message = state?.message || 'Connecting to clinic display…';

  return (
    <div className={`waiting-room-display status-${state?.status || 'please_wait'}`}>
      <div className="waiting-room-display__status-bar">
        <span className={`waiting-room-display__dot waiting-room-display__dot--${connection}`} />
        <span>
          {sessionExpired
            ? 'Session expired — log in again on this tablet'
            : connection === 'live'
              ? 'Live'
              : connection === 'reconnecting'
                ? 'Reconnecting…'
                : 'Connecting…'}
        </span>
      </div>

      <div className="waiting-room-display__content">
        <p className="waiting-room-display__eyebrow">Clinic Waiting Room</p>
        <h1 className="waiting-room-display__title">{title}</h1>
        <p className="waiting-room-display__message">{message}</p>
      </div>

      <div className="waiting-room-display__footer">
        {!speechUnlocked ? (
          <button
            type="button"
            className="waiting-room-display__enable-speech"
            onClick={enableAnnouncements}
          >
            Enable announcements 🔊
          </button>
        ) : (
          <p className="waiting-room-display__speech-note">
            {state?.announcementsEnabled
              ? 'Announcements on'
              : 'Announcements muted by staff'}
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitingRoomDisplayPage;
