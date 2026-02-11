import React, { useEffect, useState } from "react";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { QuizApprovalTable } from "../../components/admin/quizzes/QuizApprovalTable";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { SuccessAlert } from "../../components/ui/SuccessAlert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";

interface QuizItem {
  _id: string;
  title: string;
  author_id: number;
  duration: number;
  status: string;
}

const ModeratorsQuizPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const data = await quizAPI.getAllQuizzes();
      setQuizzes(data);
    } catch (err: any) {
      setError(err.message || "Failed to load quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleDelete = async (quizId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${title}"?`))
      return;
    try {
      await quizAPI.deleteQuiz(quizId);
      setSuccess(`Deleted quiz "${title}"`);
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message || "Failed to delete quiz");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">
            Manage Quizzes
          </h1>
          <p className="mt-1 text-gray-500">
            View and delete your own quizzes.
          </p>
        </div>

        {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}
        {success && <SuccessAlert message={success} onDismiss={() => setSuccess("")} />}

        {loading ? (
          <LoadingSpinner message="Loading quizzes..." />
        ) : (
          <QuizApprovalTable
            quizzes={quizzes}
            onDeleteClick={handleDelete}
            showReviewButton={false}
          />
        )}
      </div>
    </div>
  );
};

export default ModeratorsQuizPage;