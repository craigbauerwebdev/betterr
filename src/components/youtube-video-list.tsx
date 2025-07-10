import React, { useRef } from "react";
import ReactDOM from "react-dom";
import { useVideo } from "../contexts/video-context";

const YouTubeVideoList: React.FC = () => {
  const { selectedVideo, setSelectedVideo, isMinimized, setIsMinimized } =
    useVideo();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  if (!selectedVideo) return null;

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return ReactDOM.createPortal(
    <div
      className={`fixed bottom-2 right-2 bg-gray-800 shadow-lg rounded-lg transition-all duration-300 z-50 ${
        isMinimized ? "w-48" : "w-72"
      }`}
      style={{ overflow: "visible", touchAction: "manipulation" }}
    >
      <div className={`p-2 ${isMinimized ? "pb-1" : ""}`}>
        <div className={isMinimized ? "hidden" : ""}>
          <iframe
            ref={iframeRef}
            width="100%"
            height="160"
            src={`https://www.youtube-nocookie.com/embed/${selectedVideo}?playsinline=1&enablejsapi=1&autoplay=1&modestbranding=1&rel=0&showinfo=0`}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
        <div className="flex justify-between mt-1">
          <button
            onClick={() => setSelectedVideo(null)}
            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={toggleMinimize}
            className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors duration-200"
          >
            {isMinimized ? "Maximize" : "Minimize"}
          </button>
        </div>
        {isMinimized && (
          <p className="mt-1 text-xs text-gray-300 text-center">
            Click 'Maximize' to watch
          </p>
        )}
      </div>
    </div>,
    document.body
  );
};

export default YouTubeVideoList;
