from flask_jwt_extended import create_access_token
from app.Domain.models.User import User
from datetime import datetime, timedelta

class AuthResult:
    SUCCESS = "SUCCESS"
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    BLOCKED = "BLOCKED"

class AuthService:
    def login(self, user: User | None, password: str):
        
        #ako user ne postoji
        if user is None:
            return AuthResult.INVALID_CREDENTIALS, None
        
        #ako je user blokiran
        if user.blocked_until and user.blocked_until > datetime.utcnow():
            return AuthResult.BLOCKED, None
        
        #pogresna lozinka
        if not user.verify_password(password):
            user.failed_attemtps += 1

            if user.failed_attemtps >= 3:
                user.blocked_until = datetime.utcnow() + timedelta(minutes=1)
                user.failed_attemtps = 0
        
            return AuthResult.INVALID_CREDENTIALS, None
        
        user.failed_attemtps = 0
        user.blocked_until = None

        token = create_access_token(
            identity = user.id,
            additional_claims = {"role": user.role}
        )

        return AuthResult.SUCCESS, token