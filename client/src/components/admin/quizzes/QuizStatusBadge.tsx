import React from "react";

interface Props {
  status: string;
}

export const QuizStatusBadge: React.FC<Props> = ({ status }) => {
  const colors = {
    PENDING: "bg-amber-100 text-amber-700 border-amber-200",
    APPROVED: "bg-emerald-100 text-emerald-700 border-emerald-200",
    REJECTED: "bg-red-100 text-red-700 border-red-200",
  } as const;

  return (
    <span className={`px-3 py-1 text-xs font-medium rounded-full border ${colors[status as keyof typeof colors] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
      {status}
    </span>
  );
};