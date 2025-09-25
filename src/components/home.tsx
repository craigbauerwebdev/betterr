import React, { useEffect, useState, useCallback } from "react";
import { ref, get, child } from "firebase/database";
import { useFirebase } from "../contexts/firebase-context";
import { useAuth } from "../contexts/auth-context";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

interface HabitStatus {
  [habitId: string]: boolean;
}

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#83A6ED",
  "#8DD1E1",
  "#82CA9D",
  "#A4DE6C",
  "#D0ED57",
  "#FFC658",
  "#FF9F40",
  "#B39DDB",
  "#4DB6AC",
  "#F06292",
];

const Home: React.FC = () => {
  const { database } = useFirebase();
  const { user } = useAuth();
  const [allHabitStatus, setAllHabitStatus] = useState<{
    [date: string]: HabitStatus;
  }>({});

  const loadAllHabitStatus = useCallback(async () => {
    if (!user) {
      setAllHabitStatus({});
      return;
    }
    const dbRef = ref(database);
    try {
      const snapshot = await get(child(dbRef, `users/${user.uid}/habitStatus`));
      if (snapshot.exists()) {
        setAllHabitStatus(snapshot.val());
      } else {
        setAllHabitStatus({});
      }
    } catch (error) {
      console.error("Error loading all habit status:", error);
    }
  }, [database, user]);

  useEffect(() => {
    loadAllHabitStatus();
  }, [loadAllHabitStatus]);

  const calculateHabitCompletion = () => {
    const habitCounts: {
      [habitId: string]: { completed: number; total: number };
    } = {};

    Object.values(allHabitStatus).forEach((dayStatus) => {
      Object.entries(dayStatus).forEach(([habitId, completed]) => {
        if (!habitCounts[habitId]) {
          habitCounts[habitId] = { completed: 0, total: 0 };
        }
        habitCounts[habitId].total++;
        if (completed) {
          habitCounts[habitId].completed++;
        }
      });
    });

    return Object.entries(habitCounts).map(([habitId, counts]) => ({
      name: habitId,
      completionRate: (counts.completed / counts.total) * 100,
    }));
  };

  const habitCompletionData = calculateHabitCompletion();

  const calculateDailyCompletion = () => {
    return Object.entries(allHabitStatus).map(([date, habits]) => {
      const completedCount = Object.values(habits).filter(Boolean).length;
      const totalCount = Object.values(habits).length;
      return {
        date,
        completionRate: (completedCount / totalCount) * 100,
      };
    });
  };

  const dailyCompletionData = calculateDailyCompletion();

  return (
    <div className="relative max-w-4xl mx-auto mt-0 p-6 text-gray-200">
      <h2 className="text-2xl font-bold mb-4 text-blue-400">Dashboard</h2>

      {/* <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-blue-300">
          Habit Completion Rates
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={habitCompletionData}
            margin={{ left: -30, right: 0, top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

      <div>
        <h3 className="text-xl font-semibold mb-2 text-blue-300">
          Overall Habit Distribution
        </h3>
        <div className="flex items-start gap-6">
          <div className="flex-1">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={habitCompletionData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="completionRate"
                  labelLine={false}
                  label={false}
                >
                  {habitCompletionData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-auto max-w-full text-sm self-center md:self-center shrink-0">
            <div className="space-y-2">
              {habitCompletionData.map((item, index) => (
                <div key={`legend-${index}`} className="flex items-center gap-2">
                  <span
                    className="inline-block"
                    style={{
                      width: 12,
                      height: 12,
                      backgroundColor: COLORS[index % COLORS.length],
                      borderRadius: 2,
                    }}
                  />
                  <span className="text-gray-300">{item.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-2 text-blue-300">
          Daily Completion Rates
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={dailyCompletionData}
            margin={{ left: -30, right: 0, top: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="completionRate" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Home;
