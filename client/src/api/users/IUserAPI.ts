import type { UserDTO } from "../../models/user/UserDTO";
import type { RegisterDTO } from "../../models/user/RegisterDTO";
import type { UpdateProfileDTO } from "../../models/user/UpdateProfileDTO";
import type { UserListResponse } from "../../types/user/UserListResponse";
import type { UserCreatedDTO } from "../../models/user/UserCreatedDTO";
import type { ImageUploadResponse } from "../../types/user/ImageUploadResponse";

interface RegisterResponse {
  user: UserCreatedDTO;
  access_token: string;
}

export interface IUserAPI {
  getProfile(): Promise<UserDTO>;
  updateProfile(data: UpdateProfileDTO): Promise<UserDTO>;
  uploadProfileImage(file: File): Promise<ImageUploadResponse>;
  register(data: RegisterDTO): Promise<RegisterResponse>;
  getAllUsers(): Promise<UserListResponse>;
  deleteUser(userId: number): Promise<UserCreatedDTO>;
  changeUserRole(userId: number, role: string): Promise<UserDTO>;
  getUserById(userId: number): Promise<UserDTO>;
}