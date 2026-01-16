from flask import Blueprint, jsonify, request
from dataclasses import asdict
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.Services.UserService import UserService
from app.Domain.enums.role import Role
from app.Middleware.role_required import role_required

user_bp = Blueprint("users", __name__)
user_service = UserService()

# CREATE
@user_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()
    dto, status = user_service.create_user(data)

    if not dto:
        return jsonify({"error": "User already exists or invalid data"})

    return jsonify(asdict(dto)), status

# DELETE
@user_bp.route("/delete/<int:user_id>", methods=["DELETE"])
@jwt_required()
@role_required(Role.ADMIN)
def delete_user(user_id):
    dto, status = user_service.delete_user(user_id)

    if not dto:
        return jsonify({"error": f"User with id {user_id} not found"}), status

    return jsonify(asdict(dto), status)

# UPDATE
@user_bp.route("/update_profile/<int:user_id>", methods=["PUT"])
@jwt_required()
@role_required(Role.PLAYER, Role.MODERATOR)
def update_user_profile(user_id):
    current_user_id = int(get_jwt_identity())

    if current_user_id != user_id:
        return jsonify({"error": "You can only update your own profile"}), 403

    data = request.get_json()
    dto, status = user_service.update_user_profile(user_id, data)

    if not dto:
        return jsonify({"error": f"User with id {user_id} not found"}), status

    return jsonify(asdict(dto)), status

# CHANGE ROLE
@user_bp.route("/change_role/<int:user_id>", methods=["PUT"])
@jwt_required()
@role_required(Role.ADMIN)
def change_user_role(user_id):
    data = request.get_json()
    new_role_str = data.get("role")

    # premestiti u validation
    if not new_role_str:
        return jsonify({"error": "Role is required"}), 400

    try:
        new_role = Role(new_role_str)
    except ValueError:
        return jsonify({"error": "Invalid role"}), 400

    dto, status = user_service.change_user_role(user_id, new_role)

    if not dto:
        return jsonify({"error": f"User with id {user_id} not found"}), status

    return jsonify(asdict(dto)), status

# GET BY ID
@user_bp.route("/<int:user_id>", methods=["GET"])
def get_user_by_id(user_id):
    dto, status = user_service.get_user_by_id(user_id)

    if not dto:
        return jsonify({"error": f"User with id {user_id} not found"}), status

    return jsonify(asdict(dto)), status

# GET ALL USERS
@user_bp.route("/all", methods=["GET"])
@jwt_required()
@role_required(Role.ADMIN)
def get_all_users():
    dto, status = user_service.get_all_users()
    return jsonify(asdict(dto)), status

# /api/users/me -> mozda

# /api/users//profile-image/<id> -> kad se doda baza i front odradi