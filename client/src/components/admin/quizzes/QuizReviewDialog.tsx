import React, { useState, useEffect } from "react";
import { questionsAPI } from "../../../api/questions/QuestionsAPI";

interface Question {
  text: string;
  options: string[];
  correct_answers?: string[];
  points: number;
}

interface QuizData {
  _id: string;
  title: string;
  duration: number;
  questions?: Question[];
}

interface Props {
  open: boolean;
  quizTitle: string;
  quizId?: string;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export const QuizReviewDialog: React.FC<Props> = ({
  open,
  quizTitle,
  quizId,
  onClose,
  onApprove,
  onReject,
}) => {
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  useEffect(() => {
    const loadQuiz = async () => {
      if (!open || !quizId) return;
      try {
        setLoading(true);
        setError("");
        const data = await questionsAPI.getQuizById(quizId);
        setQuiz({
          ...data,
          questions: Array.isArray(data.questions) ? data.questions : [],
        });
      } catch (err: any) {
        console.error("Quiz load error:", err);
        setError(err.message || "Failed to load quiz details");
      } finally {
        setLoading(false);
      }
    };
    loadQuiz();
  }, [open, quizId]);

  const handleReject = () => {
    if (!reason.trim()) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }
    onReject(reason.trim());
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 overflow-y-auto px-4 py-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-6 animate-in fade-in duration-200">
        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2 text-center">
          Review Quiz: <span className="text-violet-600">{quizTitle}</span>
        </h2>
        <p className="text-gray-500 text-center mb-6">
          Review questions before approving or rejecting
        </p>

        {/* Loading/Error */}
        {loading && (
          <div className="text-center text-gray-500 py-8">Loading quiz...</div>
        )}
        {error && (
          <div className="text-center text-red-500 py-4 font-medium">
            {error}
          </div>
        )}

        {/* Questions Preview */}
        {!loading && !error && quiz && (quiz.questions?.length ?? 0) > 0 && (
          <div className="max-h-[60vh] overflow-y-auto space-y-5 mb-6 pr-1">
            {quiz.questions!.map((q, i) => (
              <div
                key={i}
                className="p-5 border border-gray-200 rounded-xl bg-gray-50/70"
              >
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-gray-800">
                    {i + 1}. {q.text}
                  </h3>
                  <span className="text-sm text-gray-500">
                    Points: {q.points}
                  </span>
                </div>

                <div className="grid gap-2">
                  {q.options.map((opt, idx) => {
                    const isCorrect =
                      Array.isArray(q.correct_answers) &&
                      q.correct_answers.includes(opt);
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-2 rounded-lg text-sm border flex items-center justify-between ${
                          isCorrect
                            ? "border-emerald-300 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 bg-white text-gray-700"
                        }`}
                      >
                        <span>{opt}</span>
                        {isCorrect && (
                          <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Correct
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Rejection reason */}
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Rejection reason:
          </label>
          <textarea
            placeholder="Enter rejection reason..."
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className={`w-full border rounded-lg p-3 mb-6 focus:ring-2 outline-none resize-none transition-all duration-200 ${
              shake
                ? "border-red-500 animate-shake"
                : "focus:ring-violet-300 border-gray-300"
            }`}
            rows={3}
          ></textarea>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 flex-wrap">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition"
          >
            Cancel
          </button>
          <button
            onClick={onApprove}
            className="px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg transition"
          >
            Approve
          </button>
          <button
            onClick={handleReject}
            className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg transition"
          >
            Reject
          </button>
        </div>
      </div>
    </div>
  );
};

const style = document.createElement("style");
style.innerHTML = `
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  20%, 60% { transform: translateX(-6px); }
  40%, 80% { transform: translateX(6px); }
}
.animate-shake {
  animation: shake 0.3s;
}
`;
document.head.appendChild(style);