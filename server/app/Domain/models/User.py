from Domain.enums.Role import Role
from datetime import datetime
from Extensions.bcrypt import bcrypt

class User:
    def __init__(self, id: int,
                       email: str,
                       password_hash: str,
                       role: Role,
                       failed_attempts: int,
                       blocked_until: datetime):
        self.id = id
        self.email = email
        self.password_hash = password_hash
        self.role = role
        self.failed_attemtps = failed_attempts
        self.blocked_until = blocked_until

    def verify_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)
        