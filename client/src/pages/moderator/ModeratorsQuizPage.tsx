import React, { useEffect, useState } from "react";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { QuizApprovalTable } from "../../components/admin/quizzes/QuizApprovalTable";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { SuccessAlert } from "../../components/ui/SuccessAlert";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { socketService } from "../../services/socketService";

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

    const socket = socketService.connect();

    // kviz odobren
    socket.on("quiz_published", (data: any) => {
      console.log("A quiz was published:", data);
      setSuccess(data.message || "One of your quizzes was approved!");
      fetchQuizzes();
    });

    // kviz odbijen
    socket.on("quiz_rejected", (data: any) => {
      console.log("Quiz rejected:", data);
      setError(`Your quiz was rejected: ${data.rejection_reason || "No reason provided"}`);
      fetchQuizzes();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleDelete = async (quizId: string, title: string) => {
    if (!window.confirm(`Are you sure you want to delete quiz "${title}"?`)) return;
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
            View and track your quizzes. You will be notified in real time if the admin approves or rejects them.
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
          refreshData={fetchQuizzes}
          mode="moderator"
        />
      )}
      </div>
    </div>
  );
};

export default ModeratorsQuizPage;