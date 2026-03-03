import React, { useState, useRef, useEffect } from 'react';
import './EmbeddedVideo.css';

/**
 * EmbeddedVideo Component
 * 
 * Inline video player for chapter content
 * - Play/pause controls
 * - Volume control
 * - Duration display
 * - Responsive design
 * - No auto-play
 * - Mobile-friendly
 */
const EmbeddedVideo = ({ 
  videoId, 
  videoPath, 
  title = 'Chapter Video', 
  duration = '0:00',
  showCaption = true,
  caption = '',
  hideControls = true
}) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showOverlayControls, setShowOverlayControls] = useState(true);
  const controlsTimerRef = useRef(null);

  const scheduleControlsHide = () => {
    if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    if (!hideControls || !videoRef.current) return;
    if (!videoRef.current.paused) {
      controlsTimerRef.current = setTimeout(() => {
        setShowOverlayControls(false);
      }, 1800);
    }
  };

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        setShowOverlayControls(true);
        scheduleControlsHide();
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        setShowOverlayControls(true);
      }
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      setVideoDuration(videoRef.current.duration);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
    if (newVolume > 0) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      if (isMuted) {
        videoRef.current.volume = volume;
        setIsMuted(false);
      } else {
        videoRef.current.volume = 0;
        setIsMuted(true);
      }
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setShowOverlayControls(true);
  };

  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Construct video path if not provided
  const resolvedVideoPath = videoPath || `/videos/${videoId}.mp4`;

  const handlePointerActivity = () => {
    if (!hideControls) return;
    setShowOverlayControls(true);
    scheduleControlsHide();
  };

  // Reload video source when section/video changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.load();
      setIsPlaying(false);
      setCurrentTime(0);
      setShowOverlayControls(true);
    }
  }, [resolvedVideoPath]);

  useEffect(() => {
    return () => {
      if (controlsTimerRef.current) clearTimeout(controlsTimerRef.current);
    };
  }, []);

  return (
    <div className="embedded-video-container">
      <div className="embedded-video-wrapper">
        <div
          className="video-player"
          onMouseMove={handlePointerActivity}
          onMouseLeave={() => {
            if (hideControls && isPlaying) setShowOverlayControls(false);
          }}
        >
          <video
            ref={videoRef}
            className="video-element"
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
            onClick={handlePlayPause}
            controls={!hideControls}
          >
            <source src={resolvedVideoPath} type="video/mp4" />
            Your browser does not support the video tag.
          </video>

          {(showOverlayControls || !isPlaying || !hideControls) && (
            <button
              className="center-play-btn"
              onClick={handlePlayPause}
              title={isPlaying ? 'Pause' : 'Play'}
              aria-label={isPlaying ? 'Pause video' : 'Play video'}
            >
              {isPlaying ? '❚❚' : '▶'}
            </button>
          )}

          {(showOverlayControls || !hideControls) && (
            <div className="video-controls">
              <button
                className="play-pause-btn"
                onClick={handlePlayPause}
                title={isPlaying ? 'Pause' : 'Play'}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                )}
              </button>

              <div className="progress-container">
                <input
                  type="range"
                  className="progress-bar"
                  min="0"
                  max={videoDuration || 0}
                  value={currentTime}
                  onChange={handleProgressChange}
                  aria-label="Video progress"
                />
              </div>

              <span className="time-display">
                {formatTime(currentTime)} / {formatTime(videoDuration)}
              </span>

              <div className="volume-container">
                <button
                  className="mute-btn"
                  onClick={handleMuteToggle}
                  title={isMuted ? 'Unmute' : 'Mute'}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                >
                  {isMuted || volume === 0 ? (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C23.04 14.56 24 12.84 24 11c0-4.97-4.03-9-9-9-1.84 0-3.56.96-4.5 2.4l1.51 1.51c.82-.34 1.7-.54 2.64-.54zm-10.5 2.5H6v3h3v3H9v-3H6v-3z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.1v2.02c2.89.86 5 3.54 5 6.88s-2.11 6.02-5 6.88v2.02c4.01-.91 7-4.49 7-8.9s-2.99-7.99-7-8.9z" />
                    </svg>
                  )}
                </button>
                <input
                  type="range"
                  className="volume-slider"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  aria-label="Volume control"
                />
              </div>
            </div>
          )}
        </div>

        {title && (
          <div className="video-title">
            <h4>{title}</h4>
          </div>
        )}

        {showCaption && caption && (
          <div className="video-caption">
            <p>{caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbeddedVideo;
