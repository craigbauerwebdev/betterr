import React, { createContext, useState, useContext } from "react";

interface VideoContextType {
  selectedVideo: string | null;
  setSelectedVideo: (videoId: string | null) => void;
  isMinimized: boolean;
  setIsMinimized: (isMinimized: boolean) => void;
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  return (
    <VideoContext.Provider
      value={{ selectedVideo, setSelectedVideo, isMinimized, setIsMinimized }}
    >
      {children}
    </VideoContext.Provider>
  );
};

export const useVideo = () => {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error("useVideo must be used within a VideoProvider");
  }
  return context;
};
