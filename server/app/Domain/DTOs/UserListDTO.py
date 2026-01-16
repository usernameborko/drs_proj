from dataclasses import dataclass
from typing import List
from app.Domain.DTOs.UserSummaryDTO import UserSummaryDTO

@dataclass
class UserListDTO:
    count: int
    users: List[UserSummaryDTO]