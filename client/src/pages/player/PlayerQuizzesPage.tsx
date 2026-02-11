import React, { useEffect, useState } from "react";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { Link } from "react-router-dom";

interface Question {
  text: string;
  options: string[];
  correct_answers: string[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  author_id: number;
  duration: number;
  status: string;
  questions?: Question[];
}

const PlayerQuizzesPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await quizAPI.getApprovedQuizzes();
      setQuizzes(data || []);
    } catch (err: any) {
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
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
          <p className="text-gray-500 mt-1">
            Select a quiz to play. Good luck!
          </p>
        </div>

        {quizzes.length === 0 ? (
          <div className="text-center text-gray-500 py-16">
            There are no available quizzes yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg border border-white/50 hover:shadow-xl hover:scale-[1.02] transition-transform p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-1 truncate">
                    {quiz.title}
                  </h2>
                  <p className="text-sm text-gray-500 mb-4">
                    Duration: {quiz.duration}s
                  </p>
                </div>

                <div className="text-center mt-auto">
                  <Link
                    to={`/quiz/${quiz._id}/play`}
                    className="inline-block w-full rounded-xl py-2.5 bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:from-violet-600 hover:to-indigo-600 transition-all"
                  >
                    Play Quiz
                  </Link>
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