import React, { useState } from "react";

interface Props {
  open: boolean;
  quizTitle: string;
  onClose: () => void;
  onApprove: () => void;
  onReject: (reason: string) => void;
}

export const QuizReviewDialog: React.FC<Props> = ({ open, quizTitle, onClose, onApprove, onReject }) => {
  const [reason, setReason] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 text-center">
          Review Quiz: <span className="text-violet-600">{quizTitle}</span>
        </h2>
        <p className="text-gray-500 text-center mb-4">Approve or reject this quiz submission.</p>

        <textarea
          placeholder="Enter rejection reason (optional)"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          className="w-full border border-gray-200 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-violet-300 outline-none resize-none"
          rows={3}
        ></textarea>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
          <button onClick={onApprove} className="px-4 py-2 text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg">Approve</button>
          <button onClick={() => onReject(reason)} className="px-4 py-2 text-white bg-red-500 hover:bg-red-600 rounded-lg">Reject</button>
        </div>
      </div>
    </div>
  );
};