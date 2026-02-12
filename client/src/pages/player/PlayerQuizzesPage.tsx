import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");

interface Quiz {
  _id: string;
  title: string;
  author_id: string;
  duration: number;
  status: string;
}

const PlayerQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadQuizzes = async (isSilent = false) => {
    try {
      if (!isSilent) setLoading(true);
      const data = await quizAPI.getApprovedQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuizzes();

    socket.on('quiz_published', (data) => {
      console.log("Real-time update: New quiz published!", data);
      loadQuizzes(true);
    });

    return () => {
      socket.off('quiz_published');
    };
  }, []);

  if (loading) return <LoadingSpinner message="Loading quizzes..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            Available Quizzes
          </h1>
          <p className="text-gray-500 mt-2">Choose a quiz and test your knowledge</p>
        </div>

        {quizzes.length === 0 ? (
          <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 text-center border border-dashed border-gray-300">
            <p className="text-gray-500">No quizzes available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h2>
                  <div className="space-y-1">
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Author ID:</span> {quiz.author_id}
                    </p>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium text-gray-700">Duration:</span> {quiz.duration}s
                    </p>
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <button
                    onClick={() => navigate(`/quiz/${quiz._id}/play`)}
                    className="w-full px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:from-violet-600 hover:to-indigo-600 shadow-md shadow-indigo-200 transition-all active:scale-95"
                  >
                    Play Quiz
                  </button>
                  
                  <button
                    onClick={() => navigate(`/leaderboard/${quiz._id}`)}
                    className="w-full px-4 py-2 rounded-xl font-medium text-indigo-600 border border-indigo-100 bg-white hover:bg-indigo-50 hover:border-indigo-200 transition-all text-sm"
                  >
                    View Leaderboard
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerQuizzesPage;