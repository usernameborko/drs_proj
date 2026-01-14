from flask import Blueprint, jsonify, request
from app.Services.AuthService import AuthService, AuthResult

from app.Domain.models.User import User
from app.Domain.enums.Role import Role
from app.Extensions.bcrypt import bcrypt

auth_bp = Blueprint("auth", __name__)
authService = AuthService()

#test user
hashed_password = bcrypt.generate_password_hash("123").decode("utf-8")

testUser = User(
    id = 1,
    email = "test@gmail.com",
    password_hash = hashed_password,
    role = Role.PLAYER
)

@auth_bp.route("/login", methods = ["POST"])

def login():
    data = request.get_json()

    email = data.get("email")
    password = data.get("password")

    if email == testUser.email:
        user = testUser
    else:
        user = None
    
    result, token = authService.login(user, password)

    if result == AuthResult.BLOCKED:
        return jsonify({"message": "Account is temporarily blocked"}), 403
    
    if result == AuthResult.INVALID_CREDENTIALS:
        return jsonify({"message": "Invalid credentials"}), 401
    
    return jsonify(access_token = token), 200

