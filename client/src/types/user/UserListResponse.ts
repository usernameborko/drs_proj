import type { UserSummaryDTO } from "../../models/user/UserSummaryDTO";

export interface UserListResponse {
  count: number;
  users: UserSummaryDTO[];
}