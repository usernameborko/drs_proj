import React, { useEffect, useState } from "react";
import { quizAPI } from "../../api/quizzes/QuizAPI";
import { QuizApprovalTable } from "../../components/admin/quizzes/QuizApprovalTable";
import { QuizReviewDialog } from "../../components/admin/quizzes/QuizReviewDialog";
import { socketService } from "../../services/socketService";
import { LoadingSpinner } from "../../components/ui/LoadingSpinner";
import { ErrorAlert } from "../../components/ui/ErrorAlert";
import { SuccessAlert } from "../../components/ui/SuccessAlert";
import DownloadReportButton from "../../components/admin/quizzes/DownloadReportButton";

interface QuizItem {
  _id: string;
  title: string;
  author_id: number;
  status: string;
  duration: number;
}

const QuizApprovalPage: React.FC = () => {
  const [quizzes, setQuizzes] = useState<QuizItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [selectedQuiz, setSelectedQuiz] = useState<QuizItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

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
    socketService.connect();
    socketService.onNewQuiz((data) => {
      setSuccess(data.message || "A new quiz has been submitted!");
      fetchQuizzes();
    });
    return () => socketService.disconnect();
  }, []);

  const handleApprove = async () => {
    if (!selectedQuiz) return;
    try {
      await quizAPI.reviewQuiz(selectedQuiz._id, "APPROVED");
      setSuccess(`Quiz "${selectedQuiz.title}" approved`);
      setDialogOpen(false);
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedQuiz) return;
    try {
      await quizAPI.reviewQuiz(selectedQuiz._id, "REJECTED", reason);
      setSuccess(`Quiz "${selectedQuiz.title}" rejected`);
      setDialogOpen(false);
      fetchQuizzes();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (quizId: string, title: string) => {
    if (!window.confirm(`Delete quiz "${title}"? This action cannot be undone.`))
      return;
    try {
      await quizAPI.deleteQuiz(quizId);
      setSuccess(`Quiz "${title}" deleted`);
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
          Quiz Review & Management
        </h1>
        <p className="mt-1 text-gray-500">
          Approve, reject, or delete submitted quizzes
        </p>
      </div>

      {/* OVDE UBACI DUGME */}
      <div className="flex justify-end mb-6">
        <DownloadReportButton quizzes={quizzes.map(q => ({ ...q, author_id: String(q.author_id) }))} />
      </div>

      {error && <ErrorAlert message={error} onDismiss={() => setError("")} />}
      {success && <SuccessAlert message={success} onDismiss={() => setSuccess("")} />}

      {loading ? (
        <LoadingSpinner message="Loading quizzes..." />
      ) : (
        <QuizApprovalTable
          quizzes={quizzes}
          onReviewClick={(quiz) => { setSelectedQuiz(quiz); setDialogOpen(true); }}
          onDeleteClick={handleDelete}
          refreshData={fetchQuizzes}
        />
      )}

      <QuizReviewDialog
        open={dialogOpen}
        quizTitle={selectedQuiz?.title || ""}
        quizId={selectedQuiz?._id}
        onClose={() => setDialogOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </div>
  </div>
);
};

export default QuizApprovalPage;