const BASE_URL = import.meta.env.VITE_API_URL;

export class QuestionsAPI {
  async getQuizById(quizId: string): Promise<any> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/quizzes/${quizId}`, {
      headers: {
        "Authorization": token ? `Bearer ${token}` : "",
      },
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Failed to load quiz (${response.status}): ${text}`);
    }

    return await response.json();
  }
}

export const questionsAPI = new QuestionsAPI();