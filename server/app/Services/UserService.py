from app.Domain.models.User import User
from app.Domain.enums.role import Role
from app.Extensions.bcrypt import bcrypt

class UserService:
    def __init__(self):
        self.users = []

    def create_user(self, data):
        email = data.get("email")
        password = data.get("password")
        hashed_password = bcrypt.generate_password_hash(password).decode("utf-8")

        new_user = User(
            id = len(self.users) + 1,
            email = email,
            password_hash = hashed_password,
            role = Role.PLAYER
        )

        self.users.append(new_user)
        return {"message": f"User {email} created successfully"}

    def delete_user(self, user_id):
        for user in self.users:
            if user.id == user_id:
                self.users.remove(user)
                return {"message": f"User with id {user_id} deleted successfully"}

        return {"message": f"User with id {user_id} not found"}

    def update_user_profile(self, user_id, data):
        for user in self.users:
            if user.id == user_id:
                user.email = data.get("email", user.email)
                if "password" in data:
                    new_hashed = bcrypt.generate_password_hash(data["password"]).decode("utf-8")
                    user.password_hash = new_hashed
                    return {"message": f"User {user_id} profile updated successfully"} 
                return {"message": f"User {user_id} not found"}

    def change_user_role(self, user_id, new_role):
        for user in self.users:
            if user.id == user_id:
                user.role = new_role
                return {"message": f"Role of user {user.email} changed to {new_role.value}"}
            return {"message": f"User {user_id} not found"}

    def get_user_by_id(self, user_id):
        for user in self.users:
            if user.id == user_id:
                return {
                    "id": user.id,
                    "email": user.email,
                    "role": user.role.value
                }

        return {"message": f"User with id {user_id} not found"}

    def get_all_users(self):
        users_data = []

        for user in self.users:
            users_data.append({
                "id": user.id,
                "email": user.email,
                "role": user.role.value
            })

        return {
            "count": len(users_data),
            "users": users_data
        }