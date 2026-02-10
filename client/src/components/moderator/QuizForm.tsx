import React, { useState } from "react";
import { QuestionList } from "./QuestionList";
import type { QuestionData } from "../../types/moderator/QuestionData";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { getToken } from "../../services/authService";

export const QuizForm: React.FC = () => {
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(60);
  const [questions, setQuestions] = useState<QuestionData[]>([
    { text: "", options: ["", ""], correct_answers: [], points: 1 },
  ]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleQuestionChange = (idx: number, updated: QuestionData) => {
    setQuestions((prev) => prev.map((q, i) => (i === idx ? updated : q)));
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { text: "", options: ["", ""], correct_answers: [], points: 1 }]);
  };

  const handleRemoveQuestion = (idx: number) => {
    setQuestions(questions.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
      const payload = {
        title,
        duration,
        author_id: getToken() ? JSON.parse(atob(getToken()!.split('.')[1])).sub : 0,
        questions,
      };

      const res = await quizAPI.createQuiz(payload);
      setMessage(`✅ Quiz created! ID: ${res.id}`);
      setTitle("");
      setQuestions([{ text: "", options: ["", ""], correct_answers: [], points: 1 }]);
    } catch (err: any) {
      console.error(err);
      setMessage(`❌ ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-xl border border-white/50">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
          Create New Quiz
        </h1>
        <p className="text-gray-500 mt-1">Fill in quiz details and questions</p>
      </div>

      {message && (
        <div className="text-center mb-4 text-sm font-medium">
          <span className={message.startsWith("✅") ? "text-emerald-600" : "text-red-600"}>
            {message}
          </span>
        </div>
      )}

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-3 py-2"
          placeholder="Enter quiz title..."
          required
        />
      </div>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">Duration (seconds)</label>
        <input
          type="number"
          value={duration}
          onChange={(e) => setDuration(parseInt(e.target.value))}
          className="w-40 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none px-3 py-2"
          min={10}
          required
        />
      </div>

      <QuestionList
        questions={questions}
        onUpdate={handleQuestionChange}
        onRemove={handleRemoveQuestion}
        onAdd={handleAddQuestion}
      />

      <div className="mt-8 text-center">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-semibold hover:scale-[1.02] transition-all disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? "Saving..." : "Submit Quiz"}
        </button>
      </div>
    </form>
  );
};