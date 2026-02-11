import React from "react";
import { QuizStatusBadge } from "./QuizStatusBadge";

interface Quiz {
  _id: string;
  title: string;
  author_id: number;
  status: string;
  duration: number;
}

interface Props {
  quizzes: Quiz[];
  onReviewClick: (quiz: Quiz) => void;
  onDeleteClick: (quizId: string, title: string) => void;
}

export const QuizApprovalTable: React.FC<Props> = ({ quizzes, onReviewClick, onDeleteClick }) => {
  if (quizzes.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        No quizzes found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-md border border-white/60">
      <table className="w-full text-left">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 text-sm text-gray-600 uppercase">
          <tr>
            <th className="px-6 py-3">Title</th>
            <th className="px-6 py-3">Author ID</th>
            <th className="px-6 py-3">Duration</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {quizzes.map((quiz) => (
            <tr key={quiz._id} className="border-t hover:bg-gray-50 transition-all">
              <td className="px-6 py-4 font-medium text-gray-800">{quiz.title}</td>
              <td className="px-6 py-4 text-gray-600">{quiz.author_id}</td>
              <td className="px-6 py-4 text-gray-600">{quiz.duration}s</td>
              <td className="px-6 py-4">
                <QuizStatusBadge status={quiz.status} />
              </td>
              <td className="px-6 py-4 text-center space-x-2">
                <button
                  onClick={() => onReviewClick(quiz)}
                  className="px-4 py-2 text-sm rounded-lg bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:scale-105 transition"
                >
                  Review
                </button>
                <button
                  onClick={() => onDeleteClick(quiz._id, quiz.title)}
                  className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white font-medium hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};