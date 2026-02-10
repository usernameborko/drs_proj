import React from "react";
import { QuizForm } from "../../components/moderator/QuizForm";

const CreateQuizPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-violet-50 to-indigo-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-4xl">
        <QuizForm />
      </div>
    </div>
  );
};

export default CreateQuizPage;