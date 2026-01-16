const API_URL = "http://127.0.0.1:5000";

// --------------------
// TYPES
// --------------------

export interface LoginResponse {
  token: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

// --------------------
// AUTH FUNCTIONS
// --------------------

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data: LoginResponse = await res.json();

  // čuvamo JWT
  localStorage.setItem("token", data.token);

  return data;
};

export const register = async (
  userData: Record<string, unknown>
): Promise<RegisterResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  return res.json();
};

// --------------------
// TOKEN HELPERS
// --------------------

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  localStorage.removeItem("token");
};
