import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { questionsAPI } from "../../api/questions/QuestionsAPI";
import { answersAPI } from "../../api/answers/AnswersAPI";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";

interface Question {
  text: string;
  options: string[];
  points: number;
}

interface Quiz {
  _id: string;
  title: string;
  duration: number;
  questions: Question[];
}

const PlayQuizPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [answers, setAnswers] = useState<{ [key: number]: string[] }>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await questionsAPI.getQuizById(id!);
        setQuiz(data);
        setTimeLeft(data.duration);
      } catch (err: any) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (!quiz || finished) return;
    if (timeLeft <= 0) {
      handleFinish();
      return;
    }
    const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, quiz, finished]);

  const toggleOption = (qIdx: number, opt: string) => {
    setAnswers((prev) => {
      const curr = prev[qIdx] || [];
      const updated = curr.includes(opt) ? curr.filter((x) => x !== opt) : [...curr, opt];
      return { ...prev, [qIdx]: updated };
    });
  };

  const handleFinish = async () => {
    if (!quiz) return;
    setFinished(true);
    try {
      const payload = Object.entries(answers).map(([index, selected]) => ({
        question_index: parseInt(index),
        selected,
      }));
      const data = await answersAPI.submitAnswers(quiz._id, payload);
      setResult(data.details || data);
    } catch (err: any) {
      setError(err.message || "Failed to submit results");
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;
  if (!quiz) return null;

  if (finished && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50 to-indigo-50 p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 w-full max-w-xl text-center border border-white/50">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-3">
            Quiz Result
          </h2>
          <p className="text-gray-600">{quiz.title}</p>
          <div className="mt-6 text-lg font-medium text-gray-700">
            Correct: {result.correct_questions} / {result.total_questions}
          </div>
          <div className="text-xl font-bold text-violet-600 mt-2">
            {result.percentage}% score
          </div>
          <div className="mt-5">
            {result.passed ? (
              <span className="text-emerald-600 font-semibold">Passed</span>
            ) : (
              <span className="text-red-500 font-semibold">Failed</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/50">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 text-center mb-4">
          {quiz.title}
        </h1>
        <div className="text-center text-gray-600 mb-6">
          Time left: <span className="font-semibold">{timeLeft}s</span>
        </div>
        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">
              {idx + 1}. {q.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                const selected = answers[idx]?.includes(opt);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => toggleOption(idx, opt)}
                    className={`p-3 rounded-xl border transition-all ${
                      selected
                        ? "bg-violet-500 text-white shadow-md scale-[1.03]"
                        : "bg-gray-50 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <div className="text-center mt-8">
          <button
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white text-sm font-semibold rounded-xl hover:scale-105 transition"
            onClick={handleFinish}
          >
            Finish
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayQuizPage;