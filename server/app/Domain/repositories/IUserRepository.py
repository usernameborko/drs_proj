from abc import ABC, abstractmethod
from typing import List, Optional
from app.Domain.models.User import User

class IUserRepository(ABC):
    
    @abstractmethod
    def get_all(self) -> List[User]:
        """Vraca sve korisnike"""
        pass
    
    @abstractmethod
    def get_by_id(self, user_id: int) -> Optional[User]:
        """Vraca korisnika po ID-u"""
        pass
    
    @abstractmethod
    def get_by_email(self, email: str) -> Optional[User]:
        """Vraca korisnika po email-u"""
        pass
    
    @abstractmethod
    def create(self, user: User) -> User:
        """Kreira novog korisnika"""
        pass
    
    @abstractmethod
    def update(self, user: User) -> User:
        """Azurira korisnika"""
        pass
    
    @abstractmethod
    def delete(self, user_id: int) -> bool:
        """Brise korisnika"""
        pass
    
    @abstractmethod
    def save(self) -> None:
        """Cuva promene (za mock - nista, za pravu bazu - commit)"""
        pass