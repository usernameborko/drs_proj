const BASE_URL = import.meta.env.VITE_API_URL;

export class AnswersAPI {
  async submitAnswers(quizId: string, answers: any[]): Promise<any> {
    const token = localStorage.getItem("access_token");
    const response = await fetch(`${BASE_URL}/quizzes/${quizId}/submit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
      },
      body: JSON.stringify({ answers }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`Submit failed (${response.status}): ${text}`);
    }

    return await response.json();
  }
}

export const answersAPI = new AnswersAPI();