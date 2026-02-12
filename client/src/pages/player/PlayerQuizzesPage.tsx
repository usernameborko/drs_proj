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

  const loadQuizzes = async () => {
    try{
      const data = await quizAPI.getApprovedQuizzes();
      setQuizzes(data);
    } catch (err: any){
      setError(err.message || "Failed to load quizzes")
    } finally{
      setLoading(false);
    }
  }

  useEffect(() => {
    loadQuizzes();

    socket.on('quiz_published', (data) => {
      console.log("Real-time update: New quiz published!", data);
      loadQuizzes();
    });

    return () => {
      socket.off('quiz_published');
    };
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await quizAPI.getApprovedQuizzes();
        setQuizzes(data);
      } catch (err: any) {
        console.error(err);
        setError(err.message || "Failed to load quizzes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <LoadingSpinner message="Loading quizzes..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-10 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          Available Quizzes
        </h1>

        {quizzes.length === 0 ? (
          <p className="text-center text-gray-500">No quizzes found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/60 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h2>
                  <p className="text-sm text-gray-500 mb-1">
                    <strong>Author ID:</strong> {quiz.author_id}
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    <strong>Duration:</strong> {quiz.duration}s
                  </p>
                </div>
                <button
                  onClick={() => navigate(`/quiz/${quiz._id}/play`)}
                  className="mt-4 px-4 py-2 rounded-lg font-medium text-white bg-gradient-to-r from-violet-500 to-indigo-500 hover:scale-105 transition-transform"
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