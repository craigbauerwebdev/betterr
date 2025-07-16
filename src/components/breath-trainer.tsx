import React, { useState, useEffect, useRef } from "react";

type BreathingPattern = {
  inhale: number;
  inhaleHold: number;
  exhale: number;
  exhaleHold: number;
};

const breathingPatterns: Record<string, BreathingPattern> = {
  "Box Breathing": { inhale: 4, inhaleHold: 4, exhale: 4, exhaleHold: 4 },
  "4-7-8 Breathing": { inhale: 4, inhaleHold: 7, exhale: 8, exhaleHold: 4 },
  "Wim Hoff": { inhale: 2, inhaleHold: 2, exhale: 2, exhaleHold: 2 },
};

const BreathTrainer: React.FC = () => {
  const [selectedPattern, setSelectedPattern] =
    useState<string>("Box Breathing");
  const [duration, setDuration] = useState<number>(2);
  const [currentPhase, setCurrentPhase] = useState<string>("");
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState<number>(0);
  const [exerciseCompleted, setExerciseCompleted] = useState<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout[]>([]);

  const [circleSize, setCircleSize] = useState<string>("w-32 h-32");
  const [animationDuration, setAnimationDuration] = useState<number>(4);

  const [countdown, setCountdown] = useState<number | null>(null);

  const animateCircle = (phase: string, duration: number) => {
    setAnimationDuration(duration);
    switch (phase) {
      case "Inhale":
        setCircleSize("w-64 h-64");
        break;
      case "Exhale":
        setCircleSize("w-32 h-32");
        break;
      default:
        // Do nothing for "Hold" phases
        break;
    }
  };

  const resetCircle = () => {
    setCircleSize("w-32 h-32");
    setAnimationDuration(0);
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      setCurrentPhase("Complete");
      setExerciseCompleted(true);
      resetCircle();
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (countdown !== null && countdown > 0) {
      interval = setInterval(() => {
        setCountdown((prevCount) =>
          prevCount !== null ? prevCount - 1 : null
        );
      }, 1000);
    } else if (countdown === 0) {
      beginExerciseAfterCountdown();
      setCountdown(null);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [countdown]);

  const startExercise = () => {
    setCountdown(3); // Start the 10-second countdown
  };

  const beginExerciseAfterCountdown = () => {
    setIsActive(true);
    setTimeLeft(duration * 60);
    setExerciseCompleted(false);
    resetCircle(); // Reset the circle to its initial state
    // Add a small delay before starting the first breath cycle
    setTimeout(() => {
      runBreathingCycle();
    }, 100);
  };

  const cancelExercise = () => {
    setIsActive(false);
    setTimeLeft(0);
    setCurrentPhase("");
    setPhaseTimeLeft(0);
    setExerciseCompleted(false);
    resetCircle();
    timeoutRef.current.forEach(clearTimeout);
    timeoutRef.current = [];
  };

  const runBreathingCycle = () => {
    const pattern = breathingPatterns[selectedPattern];
    let totalCycleTime = 0;
    const cycle = [
      { phase: "Inhale", duration: pattern.inhale },
      { phase: "Hold", duration: pattern.inhaleHold },
      { phase: "Exhale", duration: pattern.exhale },
      { phase: "Hold", duration: pattern.exhaleHold },
    ];

    cycle.forEach(({ phase, duration }) => {
      const timeout = setTimeout(() => {
        setCurrentPhase(phase);
        setPhaseTimeLeft(duration);
        animateCircle(phase, duration);
        // Start countdown for this phase
        const countdownInterval = setInterval(() => {
          setPhaseTimeLeft((prevTime) => {
            if (prevTime > 1) {
              return prevTime - 1;
            } else {
              clearInterval(countdownInterval);
              return 0;
            }
          });
        }, 1000);

        // Clear the interval when the phase is over
        setTimeout(() => clearInterval(countdownInterval), duration * 1000);
      }, totalCycleTime * 1000);
      timeoutRef.current.push(timeout);
      totalCycleTime += duration;
    });

    if (totalCycleTime < duration * 60) {
      const timeout = setTimeout(runBreathingCycle, totalCycleTime * 1000);
      timeoutRef.current.push(timeout);
    }
  };

  return (
    <div className="main-wrapper max-w-lg mx-auto mt-0 p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-200 text-center">
        Breath Trainer
      </h2>
      {!isActive && countdown === null && (
        <>
          <div className="mb-4">
            <label className="block mb-2 text-gray-200 text-center">
              Select Breathing Pattern:
            </label>
            <select
              className="w-full p-2 border rounded text-white"
              value={selectedPattern}
              onChange={(e) => setSelectedPattern(e.target.value)}
            >
              {Object.keys(breathingPatterns).map((pattern) => (
                <option key={pattern} value={pattern}>
                  {pattern}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-2 text-gray-200 text-center">
              Exercise Duration (minutes):
            </label>
            <div className="flex justify-between">
              {[2, 4, 6, 8].map((minutes) => (
                <button
                  key={minutes}
                  className={`flex-1 p-2 rounded ${
                    duration === minutes
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-black hover:bg-gray-400"
                  } mr-2 last:mr-0`}
                  onClick={() => setDuration(minutes)}
                >
                  {minutes} min
                </button>
              ))}
            </div>
          </div>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={startExercise}
          >
            Start Exercise
          </button>
        </>
      )}
      {countdown !== null && (
        <div className="mt-4 text-center">
          {/* <p className="text-white text-4xl font-bold">Get Ready!</p> */}
          <p className="text-white text-6xl font-bold mt-4">{countdown}</p>
        </div>
      )}
      {isActive && (
        <div className="mt-4 text-center text-black">
          <p className="text-white text-xl font-bold">{currentPhase}</p>
          <p className="text-white text-xl font-bold">
            {/* Time left:  */}
            {Math.floor(timeLeft / 60)}:
            {(timeLeft % 60).toString().padStart(2, "0")}
          </p>
        </div>
      )}

      {exerciseCompleted && (
        <p className="mt-4 text-center text-green-600 font-bold">
          Exercise Complete!
        </p>
      )}

      {isActive && (
        <div className="circle-warpper mt-4 text-center text-black w-64 h-64 mx-auto flex items-center justify-center">
          <div
            className={`${circleSize} rounded-full bg-blue-500 transition-all ease-in-out`}
            style={{
              transitionDuration: `${animationDuration}s`,
              background:
                "radial-gradient(circle, rgba(59, 130, 246, 0.9) 60%, rgba(59, 130, 246, 0.4) 100%)",
              boxShadow: "0 0 25px 5px rgba(59, 130, 246, 0.4)",
              filter: "blur(2px)",
            }}
          ></div>
          <div className="hidden absolute inset-0 flex items-center justify-center">
            <span className="text-4xl font-bold text-white">
              {phaseTimeLeft}
            </span>
          </div>
        </div>
      )}
      {isActive && (
        <div className="text-center mt-8">
          <button
            className="flex-1 justify-center bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
            onClick={cancelExercise}
          >
            Cancel Exercise
          </button>
        </div>
      )}
    </div>
  );
};

export default BreathTrainer;
