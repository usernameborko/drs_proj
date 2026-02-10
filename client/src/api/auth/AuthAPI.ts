import type { LoginDTO } from "../../models/auth/LoginDTO";
import type { AuthResponse } from "../../types/auth/AuthResponse";
import type { IAuthAPI } from "./IAuthAPI";

const BASE_URL = import.meta.env.VITE_API_URL

export class AuthAPI implements IAuthAPI {
  async login(data: LoginDTO): Promise<AuthResponse> {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Login failed (${response.status}): ${errText}`);
    }

    const json: AuthResponse = await response.json();

    localStorage.setItem("access_token", json.access_token);

    return json;
  }
}

export const authAPI = new AuthAPI();