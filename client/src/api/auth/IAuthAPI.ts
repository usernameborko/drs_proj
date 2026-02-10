import type { LoginDTO } from "../../models/auth/LoginDTO";
import type { AuthResponse } from "../../types/auth/AuthResponse";

export interface IAuthAPI {
    login(data: LoginDTO): Promise<AuthResponse>;
}