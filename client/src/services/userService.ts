const API_URL = "http://localhost:5000";

/* ======================================================
   SHARED HELPERS
====================================================== */

const authHeaders = (): HeadersInit => {
  const token = localStorage.getItem("access_token");
  return {
    "Content-Type": "application/json",
    Authorization: token ? `Bearer ${token}` : "",
  };
};

/* ======================================================
   TYPES
====================================================== */

export type UserRole = "PLAYER" | "MODERATOR" | "ADMIN";

export interface UserProfile {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
  role: UserRole;
  profileImage?: string; // URL ili path slike
}

export interface AuthResponse {
  token: string;
  user: UserProfile;
}

export interface ApiResponse {
  success: boolean;
  message?: string;
}

/**
 * DTO koji frontend šalje prilikom izmene profila
 */
export interface UpdateUserProfileDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  birthDate?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
}

/* ======================================================
   AUTHENTICATION
====================================================== */

export const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Invalid credentials or account blocked");

  const data = await res.json();

  console.log("1. data.access_token:", data.access_token);
  console.log("2. Pre setItem:", localStorage.getItem("access_token"));

  localStorage.setItem("access_token", data.access_token);

  console.log("3. Posle setItem:", localStorage.getItem("access_token"));

  return data;
};

export const register = async (
  data: Omit<UpdateUserProfileDTO, "password"> & { password: string },
): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Registration failed");
  return res.json();
};

export const logout = (): void => {
  localStorage.removeItem("access_token");
};

/* ======================================================
   PROFILE
====================================================== */

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("No auth token - please login first");
  }

  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.error || "Failed to fetch user profile");
  }
  return res.json();
};

export const updateUserProfile = async (
  data: UpdateUserProfileDTO,
): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/api/users/profile`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// Nova funkcija za upload profilne slike
export const updateProfileImage = async (file: File): Promise<ApiResponse> => {
  const token = localStorage.getItem("access_token");
  const formData = new FormData();
  formData.append("profileImage", file);

  const res = await fetch(`${API_URL}/api/users/profile/image`, {
    method: "POST",
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: formData,
  });

  if (!res.ok) throw new Error("Failed to upload profile image");
  return res.json();
};

/* ======================================================
   ADMIN – USER MANAGEMENT
====================================================== */

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const res = await fetch(`${API_URL}/api/users/all`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch users");

  const data = await res.json();

  return data.users || [];
};

export const deleteUser = async (userId: number): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/api/users/${userId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const changeUserRole = async (
  userId: number,
  role: UserRole,
): Promise<ApiResponse> => {
  const res = await fetch(`${API_URL}/api/users/change_role/${userId}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify({ role }),
  });

  if (!res.ok) throw new Error("Failed to change role");
  return res.json();
};
