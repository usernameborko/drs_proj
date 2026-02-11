import type { IQuizAPI, QuizCreateDTO, QuizCreatedResponse } from "./IQuizAPI";

const BASE_URL = import.meta.env.VITE_API_URL

export class QuizAPI implements IQuizAPI {
  async createQuiz(data: QuizCreateDTO): Promise<QuizCreatedResponse> {
    const response = await fetch(`${BASE_URL}/quizzes/`, {
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

  async getAllQuizzes(): Promise<any[]> {
  const token = localStorage.getItem("access_token");
  
  const response = await fetch(`${BASE_URL}/quizzes/`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch quizzes (${response.status}): ${errText}`);
    }

    return response.json();
  }

  async reviewQuiz(
  quizId: string,
  status: "APPROVED" | "REJECTED",
  rejection_reason?: string
) {
  const token = localStorage.getItem("access_token");

  const response = await fetch(`${BASE_URL}/quizzes/${quizId}/review`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ status, rejection_reason }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to update status: ${text}`);
    }

    return response.json();
  }
    async getApprovedQuizzes(): Promise<any[]> {
    const token = localStorage.getItem("access_token");

    const response = await fetch(`${BASE_URL}/quizzes/`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Failed to load quizzes (${response.status}): ${err}`);
    }

    const quizzes = await response.json();
    return quizzes.filter((q: any) => q.status === "APPROVED");
  }

    async deleteQuiz(quizId: string): Promise<void> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/quizzes/${quizId}`, {
      method: "DELETE",
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to delete quiz (${response.status}): ${text}`);
    }
  }
  
}

export const quizAPI = new QuizAPI();