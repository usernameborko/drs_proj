import React from "react";
import { OptionInput } from "./OptionInput";
import type { QuestionData } from "../../types/moderator/QuestionData";

interface QuestionFormProps {
  question: QuestionData;
  index: number;
  onUpdate: (index: number, updated: QuestionData) => void;
  onRemove: (index: number) => void;
}

export const QuestionForm: React.FC<QuestionFormProps> = ({ question, index, onUpdate, onRemove }) => {
  const handleTextChange = (text: string) => onUpdate(index, { ...question, text });
  const handlePointsChange = (points: number) => onUpdate(index, { ...question, points });

  const handleOptionChange = (i: number, value: string) => {
    const newOpts = [...question.options];
    newOpts[i] = value;
    onUpdate(index, { ...question, options: newOpts });
  };

  const handleAddOption = () =>
    onUpdate(index, { ...question, options: [...question.options, "" ] });

  const handleDeleteOption = (i: number) => {
    const newOpts = question.options.filter((_, idx) => idx !== i);
    onUpdate(index, { ...question, options: newOpts });
  };

  const toggleCorrect = (optionText: string) => {
    const newCorrect = question.correct_answers.includes(optionText)
      ? question.correct_answers.filter((x) => x !== optionText)
      : [...question.correct_answers, optionText];

    onUpdate(index, { ...question, correct_answers: newCorrect });
  };

  return (
    <div className="p-5 bg-white/90 rounded-2xl shadow-md border mb-6">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-lg text-gray-800">Question {index + 1}</h3>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-500 hover:bg-red-50 rounded-lg px-2 py-1 text-sm"
        >
          Delete
        </button>
      </div>

      <input
        type="text"
        value={question.text}
        onChange={(e) => handleTextChange(e.target.value)}
        className="w-full mb-4 px-4 py-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none"
        placeholder="Enter question text..."
      />

      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-600 mb-1">Options</label>
        {question.options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-1">
            <input
              type="checkbox"
              checked={question.correct_answers.includes(opt)}
              onChange={() => toggleCorrect(opt)}
              className="accent-violet-500"
            />
            <OptionInput value={opt} index={i} onChange={handleOptionChange} onDelete={handleDeleteOption} />
          </div>
        ))}
        <button
          type="button"
          onClick={handleAddOption}
          className="mt-2 text-sm text-violet-600 hover:text-violet-800 font-medium"
        >
          + Add option
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Points</label>
        <input
          type="number"
          value={question.points}
          onChange={(e) => handlePointsChange(parseInt(e.target.value) || 0)}
          className="w-32 px-3 py-2 border-b-2 border-indigo-200 focus:border-indigo-500 outline-none"
          min={1}
        />
      </div>
    </div>
  );
};