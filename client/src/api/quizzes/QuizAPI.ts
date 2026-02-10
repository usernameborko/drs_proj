import type { IQuizAPI, QuizCreateDTO, QuizCreatedResponse } from "./IQuizAPI";

const QUIZ_BASE_URL = "http://localhost:5001/api/quizzes";

export class QuizAPI implements IQuizAPI {
  async createQuiz(data: QuizCreateDTO): Promise<QuizCreatedResponse> {
    const response = await fetch(`${QUIZ_BASE_URL}/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to create quiz (${response.status}): ${errText}`);
    }

    return await response.json();
  }
}

export const quizAPI = new QuizAPI();