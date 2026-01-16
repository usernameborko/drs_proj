const API_URL = "http://127.0.0.1:5000";

// --- TYPES ---

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
  role: string;
}

export interface UpdateProfileResponse {
  success: boolean;
  message?: string;
}

// --- PROFILE FUNCTIONS ---

export const getUserProfile = async (): Promise<UserProfile> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/user/profile`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch user profile");
  return res.json();
};

export const updateUserProfile = async (
  data: Partial<UserProfile>
): Promise<UpdateProfileResponse> => {
  const token = localStorage.getItem("token");
  const res = await fetch(`${API_URL}/user/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

// --- ADMIN FUNCTIONS ---

export const getAllUsers = async (): Promise<UserProfile[]> => {
  const res = await fetch(`${API_URL}/users`);
  if (!res.ok) throw new Error("Failed to fetch users");
  return res.json();
};

export const deleteUser = async (userId: number): Promise<{ success: boolean }> => {
  const res = await fetch(`${API_URL}/users/${userId}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete user");
  return res.json();
};

export const changeUserRole = async (
  userId: number,
  newRole: string
): Promise<{ success: boolean }> => {
  const res = await fetch(`${API_URL}/users/${userId}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ role: newRole }),
  });
  if (!res.ok) throw new Error("Failed to change role");
  return res.json();
};
