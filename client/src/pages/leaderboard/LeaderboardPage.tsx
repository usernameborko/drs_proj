import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { leaderboardAPI } from "../../api/leaderboard/LeaderboardAPI";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";

interface LeaderboardEntry {
  full_name: string;
  score: number;
  date: string;
}

const LeaderboardPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const data = await leaderboardAPI.getLeaderboard(quizId!);
        const sorted = [...data].sort((a, b) => b.score - a.score);
        setEntries(sorted);
      } catch (err: any) {
        setError(err.message || "Failed to load leaderboard");
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [quizId]);

  if (loading) return <LoadingSpinner message="Loading leaderboard..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-8">
          Quiz Leaderboard
        </h1>

        {entries.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No results yet.</div>
        ) : (
          <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/50">
            <table className="w-full text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 text-sm text-gray-600 uppercase">
                <tr>
                  <th className="px-6 py-3">Rank</th>
                  <th className="px-6 py-3">Player</th>
                  <th className="px-6 py-3">Score</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, idx) => (
                  <tr key={idx} className="border-t hover:bg-gray-50 transition-all">
                    <td className="px-6 py-4 font-semibold text-gray-700">{idx + 1}</td>
                    <td className="px-6 py-4 text-gray-700">{entry.full_name}</td>
                    <td className="px-6 py-4 text-violet-700 font-medium">{entry.score}</td>
                    <td className="px-6 py-4 text-gray-500">
                      {new Date(entry.date).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;