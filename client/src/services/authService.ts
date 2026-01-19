const API_URL = "http://localhost:5000";

// --------------------
// TYPES
// --------------------

export interface LoginResponse {
  access_token: string;
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
  password: string,
): Promise<LoginResponse> => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
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
  localStorage.setItem("access_token", data.access_token);

  return data;
};

export const register = async (
  userData: Record<string, unknown>,
): Promise<RegisterResponse> => {
  const res = await fetch(`${API_URL}/api/users/register`, {
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
  return localStorage.getItem("access_token");
};

export const isAuthenticated = (): boolean => {
  return !!getToken();
};

export const logout = (): void => {
  localStorage.removeItem("access_token");
};
