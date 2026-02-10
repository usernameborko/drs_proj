import type { UserDTO } from "../../models/user/UserDTO";

export interface RegisterDTO {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  date_of_birth?: string;
  gender?: string;
  country?: string;
  street?: string;
  number?: string;
}

export interface UpdateProfileDTO {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  gender?: string;
  country?: string;
  street?: string;
  street_number?: string;
}

export interface UserSummaryDTO {
  id: number;
  full_name: string;
  email: string;
  role: string;
  country: string;
  created_at: string;
}

export interface UserListResponse {
  count: number;
  users: UserSummaryDTO[];
}

export interface UserCreatedDTO {
  id: number;
  email: string;
  role: string;
  created_at: string;
}

export interface ImageUploadResponse {
  message: string;
  image_path?: string;
  error?: string;
  success?: boolean;
}

export interface IUserAPI {
  getProfile(): Promise<UserDTO>;
  updateProfile(data: UpdateProfileDTO): Promise<UserDTO>;
  uploadProfileImage(file: File): Promise<ImageUploadResponse>;
  register(data: RegisterDTO): Promise<UserCreatedDTO>;
  getAllUsers(): Promise<UserListResponse>;
  deleteUser(userId: number): Promise<UserCreatedDTO>;
  changeUserRole(userId: number, role: string): Promise<UserDTO>;
  getUserById(userId: number): Promise<UserDTO>;
}