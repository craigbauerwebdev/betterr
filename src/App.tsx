import { Routes, Route } from "react-router-dom";
import Header from "./common/Header";
import Footer from "./common/Footer";
import Home from "./components/home";
import Login from "./common/login";
import Signup from "./common/signup";
import BreathTrainer from "./components/breath-trainer";
import DailyHabbits from "./components/daily-habbits";
import Relax from "./components/relax";
import YouTubeVideoList from "./components/youtube-video-list";
import { AuthProvider, useAuth } from "./contexts/auth-context";
import { FirebaseProvider } from "./contexts/firebase-context";
import { VideoProvider } from "./contexts/video-context";
import PrivateRoute from "./components/private-route";

import "./App.css";

const AuthShell: React.FC = () => {
  const { user } = useAuth();
  return (
    <>
      {user ? <Header /> : null}
      <div className="flex-grow pb-20">
        <main className="container mx-auto">
          <FirebaseProvider>
            <VideoProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route
                  path="/"
                  element={
                    <PrivateRoute>
                      <Home />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/breath-trainer"
                  element={
                    <PrivateRoute>
                      <BreathTrainer />
                    </PrivateRoute>
                  }
                />
                <Route path="/daily-habbits" element={<DailyHabbits />} />
                <Route
                  path="/relax"
                  element={
                    <PrivateRoute>
                      <Relax />
                    </PrivateRoute>
                  }
                />
                {/* <Route path="/" element={< />} /> */}
              </Routes>
              <YouTubeVideoList />
            </VideoProvider>
          </FirebaseProvider>
        </main>
      </div>
      {user ? <Footer /> : null}
    </>
  );
};

const App: React.FC = () => {
  return (
    <>
      <div>
        <AuthProvider>
          <AuthShell />
        </AuthProvider>
      </div>
    </>
  );
};

export default App;
