export interface Option {
  text: string;
}

export interface QuestionInput {
  text: string;
  options: string[];
  correct_answers: string[];
  points: number;
}

export interface QuizCreateDTO {
  title: string;
  duration: number;
  author_id: number;
  questions: QuestionInput[];
}

export interface QuizCreatedResponse {
  message: string;
  id: string;
}

export interface IQuizAPI {
  createQuiz(data: QuizCreateDTO): Promise<QuizCreatedResponse>;
}