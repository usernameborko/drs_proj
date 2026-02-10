import type { LoginDTO } from "../../models/auth/LoginDTO";

export interface LoginErrors {
  email?: string;
  password?: string;
}

export function validateLogin(data: LoginDTO): LoginErrors {
  const errors: LoginErrors = {};

  if (!data.email || data.email.trim() === "") {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.password || data.password.trim() === "") {
    errors.password = "Password is required";
  } else if (data.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  return errors;
}