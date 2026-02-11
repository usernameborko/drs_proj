import React, { useEffect, useState } from "react";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";

interface Quiz {
  _id: string;
  title: string;
  author_id: number;
  duration: number;
  status: string;
}

const PlayerQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const loadQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
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
  }, []);

  if (loading) return <LoadingSpinner message="Loading quizzes..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-8 text-center">
          Available Quizzes
        </h1>

        {quizzes.length === 0 ? (
          <div className="text-center text-gray-500 py-20">No approved quizzes available.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 p-6 
                           flex flex-col justify-between hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div>
                  <h2 className="text-xl font-bold text-indigo-700 mb-2">{quiz.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">Author ID: {quiz.author_id}</p>
                  <p className="text-sm text-gray-500">Duration: {quiz.duration}s</p>
                </div>
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}/play`)}
                  className="mt-5 py-2 px-4 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl 
                             font-medium text-sm hover:scale-105 transition-transform"
                >
                  Play Quiz
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PlayerQuizzesPage;