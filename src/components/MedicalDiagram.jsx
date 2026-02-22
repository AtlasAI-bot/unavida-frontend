import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut } from 'lucide-react';

const MedicalDiagram = ({ src, title, caption, alt = 'Medical diagram' }) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 0.2, 0.5));
  };

  return (
    <>
      {/* Thumbnail View */}
      {!isZoomed ? (
        <figure className="my-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <div className="relative">
            <img
              src={src}
              alt={alt}
              className="w-full rounded-lg cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => setIsZoomed(true)}
              title="Click to zoom"
            />
            <button
              onClick={() => setIsZoomed(true)}
              className="absolute bottom-4 right-4 p-2 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
              title="Zoom"
            >
              <ZoomIn size={20} className="text-gray-700" />
            </button>
          </div>
          {title && (
            <figcaption className="mt-4">
              <p className="font-semibold text-gray-900">{title}</p>
              {caption && (
                <p className="text-sm text-gray-600 mt-2">{caption}</p>
              )}
            </figcaption>
          )}
        </figure>
      ) : (
        /* Zoomed Modal View */
        <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex flex-col items-center justify-center p-4">
          {/* Close Button */}
          <button
            onClick={() => {
              setIsZoomed(false);
              setZoom(1);
            }}
            className="absolute top-6 right-6 p-3 bg-white rounded-full hover:bg-gray-200 transition-colors"
          >
            <X size={24} className="text-gray-900" />
          </button>

          {/* Image Container */}
          <div className="flex-1 flex items-center justify-center overflow-auto max-w-6xl">
            <div
              style={{
                transform: `scale(${zoom})`,
                transition: 'transform 0.2s ease-in-out'
              }}
            >
              <img
                src={src}
                alt={alt}
                className="max-h-[70vh] max-w-4xl rounded-lg shadow-2xl"
              />
            </div>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center gap-4 bg-black bg-opacity-70 p-4 rounded-lg">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 0.5}
              className="p-2 bg-white text-gray-900 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <ZoomOut size={20} />
            </button>

            <span className="text-white px-4 py-2 bg-gray-700 rounded">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={handleZoomIn}
              disabled={zoom >= 3}
              className="p-2 bg-white text-gray-900 rounded hover:bg-gray-200 disabled:opacity-50 transition-colors"
            >
              <ZoomIn size={20} />
            </button>

            <div className="border-l border-gray-600 h-8 mx-2" />

            {title && (
              <p className="text-white text-sm">{title}</p>
            )}
          </div>

          {/* Caption */}
          {caption && (
            <p className="text-white text-center text-sm mt-4 max-w-2xl">
              {caption}
            </p>
          )}
        </div>
      )}
    </>
  );
};

export default MedicalDiagram;
