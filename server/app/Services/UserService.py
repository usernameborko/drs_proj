from datetime import datetime
from app.Domain.models.User import User
from app.Domain.enums.role import Role
from app.Extensions.bcrypt import bcrypt
from app.Database.UserRepository import UserRepository

class UserService:
    def __init__(self):
            self.repo = UserRepository()

    def create_user(self, data):

        email = data.get("email")
        password = data.get("password")
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        if self.repo.get_by_email(email):
            return {"message": "User already exists"}, 409

        user = User(
            email=email,
            password_hash=bcrypt.generate_password_hash(password).decode("utf-8"),
            first_name=data.get("first_name"),
            last_name=data.get("last_name"),
            date_of_birth=data.get("date_of_birth"),
            gender=data.get("gender"),
            country=data.get("country"),
            street=data.get("street"),
            street_number=data.get("street_number"),
            role=Role.PLAYER,
            created_at=datetime.utcnow()
        )

        self.repo.create(user)
        return {"message": f"User {email} created successfully"}, 201

    def delete_user(self, user_id: int):
        existing_user = self.repo.get_by_id(user_id)

        if not existing_user:
            return {"message": f"User with id {user_id} not found"}

        self.repo.delete(user_id)
        return {"message": f"User with id {user_id} deleted successfully"}

    def update_user_profile(self, user_id, data):
        user = self.repo.get_by_id(user_id)

        if not user:
            return {"message": f"User with id {user_id} not found"}

        user.first_name = data.get("first_name", user.first_name)
        user.last_name = data.get("last_name", user.last_name)
        user.email = data.get("email", user.email)
        user.date_of_birth = data.get("date_of_birth", user.date_of_birth)
        user.gender = data.get("gender", user.gender)
        user.country = data.get("country", user.country)
        user.street = data.get("street", user.street)
        user.street_number = data.get("street_number", user.street_number)

        if "password" in data and data["password"]:
            new_hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
            user.password_hash = new_hashed

        self.repo.update(user)
        return {"message": f"User {user.email} profile updated successfully"}

    def change_user_role(self, user_id, new_role):
        user = self.repo.get_by_id(user_id)

        if not user:
            return {"message": f"User with id {user_id} not found"}

        user.role = new_role
        self.repo.update(user)

        return {"message": f"Role of user {user.email} changed to {new_role.value}"}

    def get_user_by_id(self, user_id: int):
        user = self.repo.get_by_id(user_id)

        if not user:
            return {"message": f"User with id {user_id} not found"}

        return {
            "id": user.id,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "email": user.email,
            "role": user.role.value,
            "country": user.country,
            "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S")
        }

    def get_all_users(self):
        users = self.repo.get_all()

        users_data = []
        for user in users:
            users_data.append({
                "id": user.id,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "role": user.role.value,
                "country": user.country,
                "created_at": user.created_at.strftime("%Y-%m-%d %H:%M:%S")
            })

        return {
            "count": len(users_data),
            "users": users_data
        }