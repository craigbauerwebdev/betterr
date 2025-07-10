import React from "react";
import { useVideo } from "../contexts/video-context";

interface Video {
  id: string;
  title: string;
}

const videos: Video[] = [
  { id: "mg7netw1JuM", title: "Study" },
  { id: "MXrPyFLZOpM", title: "Cortisol Detox" },
  { id: "UpPmnnJcy6A", title: "Focus" },
];

const Relax: React.FC = () => {
  const { setSelectedVideo } = useVideo();

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Relaxing Sounds</h2>
      <p className="mb-4">Select a video to watch:</p>
      <ul className="flex">
        {videos.map((video) => (
          <li className="mr-2 mb-2" key={video.id}>
            <button
              onClick={() => setSelectedVideo(video.id)}
              className="text-blue-500 hover:underline"
            >
              {video.title}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Relax;
