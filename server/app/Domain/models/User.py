from app.Database.db import db
from app.Domain.enums.role import Role
from datetime import datetime
from app.Extensions.bcrypt import bcrypt

class User(db.Model):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)

    role = db.Column(db.Enum(Role), default=Role.PLAYER, nullable=False)

    failed_attempts = db.Column(db.Integer, default=0, nullable=False)
    blocked_until = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def verify_password(self, password: str) -> bool:
        return bcrypt.check_password_hash(self.password_hash, password)