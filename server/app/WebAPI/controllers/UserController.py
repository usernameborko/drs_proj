from flask import Blueprint, jsonify, request
from app.Services.UserService import UserService

from app.Domain.models.User import User
from app.Domain.enums.Role import Role
from app.Extensions.bcrypt import bcrypt

user_bp = Blueprint("users", __name__)
user_service = UserService()

# CREATE
@user_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()

    if not data.get("email") or not data.get("password"):
        return jsonify({"message": "Email and password are required"}), 400

    result = user_service.create_user(data)
    return jsonify(result), 201

# DELETE
@user_bp.route("/delete/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    result = user_service.delete_user(user_id)
    if "not found" in result["message"]:
        return jsonify(result), 404
    return jsonify(result), 200

# UPDATE
@user_bp.route("/update_profile/<int:user_id>", methods=["PUT"])
def update_user_profile(user_id):
    data = request.get_json()
    result = user_service.update_user_profile(user_id, data)

    if "not found" in result["message"]:
        return jsonify(result), 404
    return jsonify(result), 200

# CHANGE ROLE
@user_bp.route("/change_role/<int:user_id>", methods=["PUT"])
def change_user_role(user_id):
    data = request.get_json()
    new_role_str = data.get("role")

    if not new_role_str:
        return jsonify({"message": "Role is required"}), 400

    try:
        new_role = Role(new_role_str)
    except ValueError:
        return jsonify({"message": "Invalid role"}), 400

    result = user_service.change_user_role(user_id, new_role)

    if "not found" in result["message"]:
        return jsonify(result), 404
    return jsonify(result), 200

# GET BY ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    result = user_service.get_user_by_id(user_id)
    if "message" in result and "not found" in result["message"]:
        return jsonify(result), 404
    return jsonify(result), 200

# GET ALL USERS
@user_bp.route("/all", methods=["GET"])
def get_all_users():
    result = user_service.get_all_users()
    return jsonify(result), 200

# /api/users/me -> mozda

# /api/users/<id>/profile-image -> kad se doda baza i front odradi