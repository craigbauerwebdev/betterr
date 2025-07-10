import { Routes, Route } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Home from "./components/home";
import BreathTrainer from "./components/breath-trainer";
import DailyHabbits from "./components/daily-habbits";
import Relax from "./components/relax";
import YouTubeVideoList from "./components/youtube-video-list";
import { FirebaseProvider } from "./contexts/firebase-context";
import { VideoProvider } from "./contexts/video-context";

import "./App.css";

const App: React.FC = () => {
  //const [count, setCount] = useState(0);

  return (
    <>
      <div>
        {/*  className="bg-gray-800" */}
        <Header />
        <div className="flex-grow pb-20">
          <main className="container mx-auto">
            <FirebaseProvider>
              <VideoProvider>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/breath-trainer" element={<BreathTrainer />} />
                  <Route path="/daily-habbits" element={<DailyHabbits />} />
                  <Route path="/relax" element={<Relax />} />
                  {/* <Route path="/" element={< />} /> */}
                </Routes>
                <YouTubeVideoList />
              </VideoProvider>
            </FirebaseProvider>
          </main>

          {/* <h1 className="text-2xl font-bold text-blue-500 mb-6">
            Daily Habbits, Breathe timer
          </h1>
          <button onClick={() => setCount((count) => count + 1)}>
            count is {count}
          </button> */}

          {/* Router CLosed */}
        </div>
        <Footer />
      </div>
    </>
  );
};

export default App;
