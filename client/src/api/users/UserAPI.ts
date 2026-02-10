import type { 
  IUserAPI, 
  RegisterDTO, 
  UpdateProfileDTO, 
  UserListResponse,
  UserCreatedDTO,
  ImageUploadResponse
} from "./IUserAPI";
import type { UserDTO, UserDTOBackend } from "../../models/user/UserDTO";
import { mapUserDTOFromBackend } from "../../models/user/UserDTO";

const BASE_URL = import.meta.env.VITE_API_URL;

export class UserAPI implements IUserAPI {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
      "Content-Type": "application/json",
      "Authorization": token ? `Bearer ${token}` : "",
    };
  }

  private getAuthHeadersOnly(): HeadersInit {
    const token = localStorage.getItem("access_token");
    return {
      "Authorization": token ? `Bearer ${token}` : "",
    };
  }

  async getProfile(): Promise<UserDTO> {
    const token = localStorage.getItem("access_token");
    if (!token) {
      throw new Error("User not authenticated.");
    }

    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: "GET",
      headers: this.getAuthHeadersOnly(),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to load user profile (${response.status}): ${errText}`);
    }

    const backend: UserDTOBackend = await response.json();
    return mapUserDTOFromBackend(backend);
  }

  async updateProfile(data: UpdateProfileDTO): Promise<UserDTO> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Unauthorized");

    const response = await fetch(`${BASE_URL}/users/profile`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Update failed (${response.status}): ${errText}`);
    }

    const backend: UserDTOBackend = await response.json();
    return mapUserDTOFromBackend(backend);
  }

  async uploadProfileImage(file: File): Promise<ImageUploadResponse> {
    const token = localStorage.getItem("access_token");
    if (!token) throw new Error("Unauthorized");

    const formData = new FormData();
    formData.append("profileImage", file);

    const response = await fetch(`${BASE_URL}/users/profile/image`, {
      method: "POST",
      headers: this.getAuthHeadersOnly(),
      body: formData,
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Image upload failed (${response.status}): ${errText}`);
    }

    return await response.json();
  }

  async register(data: RegisterDTO): Promise<UserCreatedDTO> {
    const response = await fetch(`${BASE_URL}/users/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.error || `Registration failed (${response.status})`);
    }

    return await response.json();
  }

  async getAllUsers(): Promise<UserListResponse> {
    const response = await fetch(`${BASE_URL}/users/all`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch users (${response.status}): ${errText}`);
    }

    return await response.json();
  }

  async deleteUser(userId: number): Promise<UserCreatedDTO> {
    const response = await fetch(`${BASE_URL}/users/delete/${userId}`, {
      method: "DELETE",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to delete user (${response.status}): ${errText}`);
    }

    return await response.json();
  }

  async changeUserRole(userId: number, role: string): Promise<UserDTO> {
    const response = await fetch(`${BASE_URL}/users/change_role/${userId}`, {
      method: "PUT",
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ role }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to change role (${response.status}): ${errText}`);
    }

    const backend: UserDTOBackend = await response.json();
    return mapUserDTOFromBackend(backend);
  }

  async getUserById(userId: number): Promise<UserDTO> {
    const response = await fetch(`${BASE_URL}/users/${userId}`, {
      method: "GET",
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Failed to fetch user (${response.status}): ${errText}`);
    }

    const backend: UserDTOBackend = await response.json();
    return mapUserDTOFromBackend(backend);
  }
}

export const userAPI = new UserAPI();