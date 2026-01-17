from flask import Blueprint, jsonify, request
from app.Services.AuthService import AuthService, AuthResult

from app.Domain.models.User import User
from app.Domain.enums.role import Role
from app.Extensions.bcrypt import bcrypt

auth_bp = Blueprint("auth", __name__)
authService = AuthService()


@auth_bp.route("/login", methods = ["POST"])

def login():
    data = request.get_json()

    print("LOGIN DATA:", data)

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"message": "Email or password are required"}), 400
    
    user = User.query.filter_by(email=email).first()
    
    result, token = authService.login(user, password)

    if result == AuthResult.BLOCKED:
        return jsonify({"message": "Account is temporarily blocked"}), 403
    
    if result == AuthResult.INVALID_CREDENTIALS:
        return jsonify({"message": "Invalid credentials"}), 401
    
    return jsonify(access_token = token), 200
