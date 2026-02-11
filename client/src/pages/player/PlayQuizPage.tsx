import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";

interface Question {
  text: string;
  options: string[];
  correct_answers: string[];
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
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const res = await fetch(`http://localhost:5001/api/quizzes/${id}`);
        if (!res.ok) throw new Error(`Failed to load quiz (${res.status})`);
        const data = await res.json();
        setQuiz(data);
      } catch (err: any) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [id]);

  useEffect(() => {
    if (quiz && !submitted) {
      const timer = setInterval(() => setElapsed((t) => t + 1), 1000);
      return () => clearInterval(timer);
    }
  }, [quiz, submitted]);

  const toggleOption = (qIdx: number, opt: string) => {
    setAnswers((prev) => {
      const current = prev[qIdx] || [];
      const updated = current.includes(opt)
        ? current.filter((x) => x !== opt)
        : [...current, opt];
      return { ...prev, [qIdx]: updated };
    });
  };

  const handleSubmit = async () => {
    if (!quiz) return;
    try {
      setSubmitted(true);
      const token = localStorage.getItem("access_token");
      let userEmail = "";
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          userEmail = payload.email || "";
        } catch {
          userEmail = "";
        }
      }

      const payload = {
        user_email: userEmail,
        answers: Object.entries(answers).map(([idx, selected]) => ({
          question_index: parseInt(idx, 10),
          selected,
        })),
        time_spent: elapsed,
      };

      const res = await fetch(`http://localhost:5001/api/quizzes/${quiz._id}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`Submit failed (${res.status})`);
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Failed to submit quiz");
    }
  };

  if (loading) return <LoadingSpinner message="Loading quiz..." />;
  if (error) return <ErrorAlert message={error} onDismiss={() => setError("")} />;
  if (!quiz) return <div className="text-center py-12">Quiz not found.</div>;

  if (submitted && result) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-violet-50 to-indigo-50 p-6">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-xl text-center border border-white/60">
          <h2 className="text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            Quiz Completed
          </h2>
          <p className="text-gray-600 mb-4">{quiz.title}</p>
          <div className="text-lg font-medium text-gray-800 mb-2">
            ✅ Correct: {result.correct_questions ?? 0}
          </div>
          <div className="text-lg font-medium text-gray-800 mb-2">
            ❌ Total: {result.total_questions ?? 0}
          </div>
          <div className="text-2xl font-bold text-violet-600 mt-2">
            Score: {Number(result.percentage ?? 0)}%
          </div>
          <div className="mt-6">
            {result.passed ? (
              <p className="text-emerald-600 font-semibold">
                Congratulations! You passed.
              </p>
            ) : (
              <p className="text-red-500 font-semibold">
                You didn’t pass — try again!
              </p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-violet-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl p-8 border border-white/60">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 text-center mb-4">
          {quiz.title}
        </h1>
        <div className="text-center text-gray-500 mb-6">
          Time: {elapsed}s / {quiz.duration}s
        </div>

        {quiz.questions.map((q, idx) => (
          <div key={idx} className="mb-6">
            <p className="font-semibold text-gray-800 mb-2">
              {idx + 1}. {q.text}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {q.options.map((opt, i) => {
                const selected = answers[idx]?.includes(opt) || false;
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

        <div className="text-center">
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-violet-500 to-indigo-500 text-white rounded-xl font-semibold hover:scale-105 transition-all"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlayQuizPage;