import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import type { QuestionData } from "../../types/moderator/QuestionData";

export const EditRejectedQuizPage: React.FC = () => {
  const { quizId } = useParams<{ quizId: string }>();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        setLoading(true);
        const data = await quizAPI.getQuizById(quizId!);
        setTitle(data.title || "");
        setDuration(data.duration || 60);
        setQuestions(
          (data.questions || []).map((q: any) => ({
            text: q.text,
            options: q.options || [],
            correct_answers: q.correct_answers || [],
            points: q.points || 1,
          }))
        );
      } catch (err: any) {
        setMessage(err.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [quizId]);

  const handleUpdate = async (e: React.FormEvent) => {
  e.preventDefault();
  if (saving) return;
  try {
    setSaving(true);
    setMessage("");
    const token = localStorage.getItem("access_token");
    let author_id = 0;
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        author_id = parseInt(payload.sub || payload.id || "0");
      } catch {
        author_id = 0;
      }
    }

    const payload = { title, duration, author_id, questions };
    await quizAPI.createQuiz(payload);
    setMessage("✅ Quiz updated and re‑submitted for approval!");
    setTimeout(() => navigate("/moderator/quizzes"), 1500);
  } catch (err: any) {
    setMessage(`❌ ${err.message}`);
  } finally {
    setSaving(false);
  }
}

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Loading quiz...
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600 mb-6 text-center">
          Edit Rejected Quiz
        </h1>
        {message && (
          <p
            className={`mb-4 text-center font-medium ${
              message.startsWith("✅")
                ? "text-emerald-600"
                : message.startsWith("❌")
                ? "text-red-600"
                : "text-gray-600"
            }`}
          >
            {message}
          </p>
        )}

        <form onSubmit={handleUpdate} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quiz Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Duration (seconds)
            </label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-40 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-3 py-2"
              min={10}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Questions
            </label>
            {questions.map((q, i) => (
              <div
                key={i}
                className="mb-4 p-4 border border-gray-200 rounded-xl bg-gray-50"
              >
                <input
                  value={q.text}
                  onChange={(e) => {
                    const newQs = [...questions];
                    newQs[i].text = e.target.value;
                    setQuestions(newQs);
                  }}
                  className="w-full mb-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-2 py-1"
                  placeholder={`Question ${i + 1}`}
                />
                {q.options.map((opt, j) => (
                  <div key={j} className="flex items-center gap-2 mb-1">
                    <input
                      type="checkbox"
                      checked={q.correct_answers.includes(opt)}
                      onChange={() => {
                        const newQs = [...questions];
                        const answers = newQs[i].correct_answers;
                        if (answers.includes(opt))
                          newQs[i].correct_answers = answers.filter(
                            (a) => a !== opt
                          );
                        else newQs[i].correct_answers = [...answers, opt];
                        setQuestions(newQs);
                      }}
                      className="accent-violet-500"
                    />
                    <input
                      value={opt}
                      onChange={(e) => {
                        const newQs = [...questions];
                        newQs[i].options[j] = e.target.value;
                        setQuestions(newQs);
                      }}
                      className="flex-1 border-b border-gray-200 focus:border-indigo-400 outline-none px-2 py-1 text-sm"
                      placeholder={`Option ${j + 1}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {saving ? "Saving..." : "Save and Resubmit"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditRejectedQuizPage;