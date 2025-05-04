import React, { useState, useRef, useEffect } from 'react';
import './Design/RadioPlayer.css';
import EqualizerBars from './EqualizerBars';

const RadioPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Audio event handlers
  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
    if (isMuted && newVolume > 0) setIsMuted(false);
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration);
  };

  const handleProgressClick = (e) => {
    const rect = e.target.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audioRef.current.currentTime = pos * duration;
  };

  // Format time display
  const formatTime = (seconds) => {
    if (!seconds) return '00:00';
    const minutes = Math.floor(seconds / 60);
    seconds = Math.floor(seconds % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="radio-player">
      <audio 
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={() => setDuration(audioRef.current.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      >
        <source src="https://eu.stream4cast.com/proxy/lavradio/stream" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>

      <div className="player-controls">
        <button className="play-pause-btn" onClick={handlePlayPause}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z"/>
            </svg>
          )}
          
        </button>

        <div className="progress-bar" onClick={handleProgressClick}>
          <div 
            className="progress" 
            style={{ width: `${(currentTime / duration) * 100}%` }}
          >
          </div>
          
        </div>

        <div className="volume-controls">
          <button className="volume-btn" onClick={handleMuteToggle}>
            {isMuted || volume === 0 ? (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,10.29 20.47,8.71 19.55,7.38L18.12,8.81C18.68,9.82 19,10.89 19,12M12.5,4.08L12,4L9,7H3V9H7L12,14V12.27L14.45,14.72C13.54,14.28 12.5,13.86 12.5,13.86V4.08Z"/>
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20">
                <path fill="currentColor" d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"/>
              </svg>
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.1"
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>
      </div>
    </div>
  );
};

export default RadioPlayer;