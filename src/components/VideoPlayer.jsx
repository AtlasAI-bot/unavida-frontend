import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download } from 'lucide-react';

const VideoPlayer = ({ src, title, duration = 0, chapters = [] }) => {
  const videoRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
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

  const handleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
    }
  };

  const handleProgressChange = (e) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (!isFullscreen) {
        if (videoRef.current.requestFullscreen) {
          videoRef.current.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
      setIsFullscreen(!isFullscreen);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleLoadedMetadata = () => {
    if (videoRef.current && videoRef.current.duration) {
      setCurrentTime(0);
    }
  };

  return (
    <div className="w-full bg-black rounded-lg overflow-hidden shadow-lg">
      {/* Video Container */}
      <div className="relative bg-black aspect-video">
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
        />

        {/* Play Button Overlay */}
        {!isPlaying && (
          <button
            onClick={handlePlayPause}
            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-50 transition-all group"
          >
            <div className="w-16 h-16 bg-white bg-opacity-90 group-hover:bg-opacity-100 rounded-full flex items-center justify-center transition-all">
              <Play size={32} className="text-black ml-1" fill="black" />
            </div>
          </button>
        )}

        {/* Loading Indicator */}
        <div className="absolute top-4 left-4 bg-black bg-opacity-50 px-3 py-1 rounded text-white text-sm font-semibold">
          {title && <span>{title}</span>}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-900 p-4 text-white">
        {/* Progress Bar */}
        <div className="mb-4">
          <input
            type="range"
            min="0"
            max={videoRef.current?.duration || 100}
            value={currentTime}
            onChange={handleProgressChange}
            className="w-full h-1 bg-gray-700 rounded cursor-pointer accent-teal-500 hover:h-2 transition-all"
          />
        </div>

        {/* Control Buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Play/Pause */}
            <button
              onClick={handlePlayPause}
              className="hover:text-teal-400 transition-colors flex items-center gap-2"
            >
              {isPlaying ? (
                <Pause size={20} />
              ) : (
                <Play size={20} />
              )}
            </button>

            {/* Volume Control */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleMute}
                className="hover:text-teal-400 transition-colors"
              >
                {isMuted ? (
                  <VolumeX size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={handleVolumeChange}
                className="w-20 h-1 bg-gray-700 rounded cursor-pointer accent-teal-500"
              />
            </div>

            {/* Time Display */}
            <span className="text-sm ml-4">
              {formatTime(currentTime)} / {formatTime(videoRef.current?.duration || 0)}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* Transcript Toggle */}
            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="px-3 py-1 text-sm bg-gray-700 hover:bg-gray-600 rounded transition-colors"
            >
              📄 Transcript
            </button>

            {/* Download */}
            <button
              className="p-1 hover:text-teal-400 transition-colors"
              title="Download video"
            >
              <Download size={20} />
            </button>

            {/* Fullscreen */}
            <button
              onClick={handleFullscreen}
              className="p-1 hover:text-teal-400 transition-colors"
              title="Fullscreen"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>

        {/* Chapters List */}
        {chapters.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm font-semibold mb-2">Chapters:</p>
            <div className="grid grid-cols-2 gap-2">
              {chapters.map((chapter) => (
                <button
                  key={chapter.id}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = chapter.timestamp;
                      setCurrentTime(chapter.timestamp);
                    }
                  }}
                  className="text-left text-sm p-2 bg-gray-800 hover:bg-gray-700 rounded transition-colors text-gray-300"
                >
                  <span className="text-teal-400">{formatTime(chapter.timestamp)}</span>
                  {' '}{chapter.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Transcript */}
        {showTranscript && (
          <div className="mt-4 pt-4 border-t border-gray-700">
            <p className="text-sm font-semibold mb-2">Transcript:</p>
            <div className="bg-gray-800 p-3 rounded text-sm text-gray-300 max-h-40 overflow-y-auto">
              <p>Video transcript would be displayed here. This can be fetched from the backend API or stored in the JSON metadata.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoPlayer;
