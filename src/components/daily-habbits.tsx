import React, { useState, useEffect } from "react";
import { ref, set, get, child } from "firebase/database";
import { useFirebase } from "../contexts/firebase-context";

const habitsList = [
  { id: "slp", text: "Get 7+ hours of sleep" },
  { id: "cpl", text: "Cold plunge" },
  { id: "exs", text: "Excercise (40 minutes)" },
  { id: "sup", text: "Take supplements" },
  { id: "gal", text: "Drink 1 gallon of water" },
  { id: "trk", text: "Track food" },
  { id: "stp", text: "Get > 8000 steps" },
  { id: "sau", text: "10 minute sauna" },
  { id: "hsr", text: "Hot Showeer" },
  { id: "bed", text: "Bed by 10pm" },
];

/* interface HabitItem {
  id: string;
  text: string;
  completed: boolean;
} */

interface HabitStatus {
  [habitId: string]: boolean;
}

const DailyHabbits: React.FC = () => {
  const { database } = useFirebase();

  const [habitStatus, setHabitStatus] = useState<HabitStatus>({});
  const [date, setDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(today.getDate()).padStart(2, "0")}`;
  });
  const [allHabitStatus, setAllHabitStatus] = useState<{
    [date: string]: HabitStatus;
  }>({});

  const loadAllHabitStatus = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, "habitStatus"));
      if (snapshot.exists()) {
        setAllHabitStatus(snapshot.val());
      } else {
        setAllHabitStatus({});
      }
    } catch (error) {
      console.error("Error loading all habit status:", error);
    }
  };

  useEffect(() => {
    loadAllHabitStatus();
  }, []);

  useEffect(() => {
    loadHabitStatus();
  }, [date]);

  const calculateCompletionRate = (habitId: string) => {
    const totalDays = Object.keys(allHabitStatus).length;
    const completedDays = Object.values(allHabitStatus).filter(
      (dayStatus) => dayStatus[habitId]
    ).length;
    return totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
  };

  const loadHabitStatus = async () => {
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `habitStatus/${date}`));
      if (snapshot.exists()) {
        setHabitStatus(snapshot.val());
      } else {
        setHabitStatus({});
      }
    } catch (error) {
      console.error("Error loading habit status:", error);
    }
  };

  const saveHabitStatus = async (habitId: string, completed: boolean) => {
    try {
      await set(ref(database, `habitStatus/${date}/${habitId}`), completed);
    } catch (error) {
      console.error("Error saving habit status:", error);
    }
  };

  const toggleHabit = (id: string) => {
    const newStatus = !habitStatus[id];
    setHabitStatus({ ...habitStatus, [id]: newStatus });
    saveHabitStatus(id, newStatus);
  };

  const changeDate = (days: number) => {
    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + days);
    setDate(newDate.toISOString().split("T")[0]);
  };

  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-").map(Number);
    const date = new Date(year, month - 1, day); // month is 0-indexed in Date constructor
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const formattedDate = date.toLocaleDateString(undefined, options);

    const today = new Date();
    const isToday =
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear();

    return isToday ? `Today (${formattedDate})` : formattedDate;
  };

  return (
    <div className="relative max-w-lg mx-auto mt-0 p-6 text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Daily Habits</h2>
      <div className="absolute top-5 right-2">
        <button
          onClick={() => changeDate(-1)}
          className="text-sm text-blue-400 hover:text-blue-300 py-2 px-3 mr-1"
        >
          &#8592;
        </button>
        <button
          onClick={() => changeDate(1)}
          className="text-sm text-blue-400 hover:text-blue-300 py-2 px-3 mr-1"
        >
          &#8594;
        </button>
      </div>
      <div className="mb-4 flex items-center justify-between">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full p-2 border rounded bg-gray-700 text-white border-gray-600 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
        />
      </div>
      <div className="text-lg font-semibold text-blue-300 mb-2">
        {formatDate(date)}
      </div>
      <ul>
        {habitsList.map((habit) => (
          <li key={habit.id} className="flex items-center mb-2">
            <input
              type="checkbox"
              checked={habitStatus[habit.id] || false}
              onChange={() => toggleHabit(habit.id)}
              className="mr-2"
            />
            <span className={habitStatus[habit.id] ? "line-through" : ""}>
              {habit.text}
            </span>
            <div className="bg-blue-200 text-blue-800 text-xs font-semibold px-1 py-0 ml-2 rounded-full">
              {calculateCompletionRate(habit.id).toFixed(2)}%
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DailyHabbits;
