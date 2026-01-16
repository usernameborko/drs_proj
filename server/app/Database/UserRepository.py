from app.Domain.repositories.IUserRepository import IUserRepository
from app.Domain.models.User import User
from app.Database.db import db
from typing import List, Optional

class UserRepository(IUserRepository):

    def get_all(self) -> List[User]:
        return User.query.all()
    
    def get_by_id(self, user_id: int) -> Optional[User]:
        return User.query.filter_by(id=user_id).first()
    
    def get_by_email(self, email: str) -> Optional[User]:
        return User.query.filter_by(email=email).first()

    def create(self, user: User) -> User:
        db.session.add(user)
        self.save()
        return user
    
    def update(self, user: User) -> User:
        self.save()
        return user

    def delete(self, user_id: int) -> bool:
        user = self.get_by_id(user_id)
        if not user:
            return False
        db.session.delete(user)
        self.save()
        return True

    def save(self) -> None:
        try:
            db.session.commit()
        except Exception as e:
            db.session.rollback()
            raise e