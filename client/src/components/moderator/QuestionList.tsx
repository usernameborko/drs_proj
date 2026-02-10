import React from "react";
import { QuestionForm } from "./QuestionForm";
import type { QuestionData } from "../../types/moderator/QuestionData";

interface QuestionListProps {
  questions: QuestionData[];
  onUpdate: (idx: number, newQuestion: QuestionData) => void;
  onRemove: (idx: number) => void;
  onAdd: () => void;
}

export const QuestionList: React.FC<QuestionListProps> = ({ questions, onUpdate, onRemove, onAdd }) => {
  return (
    <div className="mt-6">
      {questions.map((q, i) => (
        <QuestionForm
          key={i}
          question={q}
          index={i}
          onUpdate={onUpdate}
          onRemove={onRemove}
        />
      ))}

      <div className="text-center">
        <button
          type="button"
          onClick={onAdd}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-indigo-500 text-white font-medium hover:scale-105 transition-transform"
        >
          + Add Question
        </button>
      </div>
    </div>
  );
};