import React from "react";

interface OptionInputProps {
  value: string;
  index: number;
  onChange: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

export const OptionInput: React.FC<OptionInputProps> = ({ value, index, onChange, onDelete }) => {
  return (
    <div className="flex items-center gap-3 mb-2">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(index, e.target.value)}
        className="flex-1 px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-violet-300 outline-none"
        placeholder={`Option ${index + 1}`}
      />
      <button
        type="button"
        onClick={() => onDelete(index)}
        className="p-2 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};