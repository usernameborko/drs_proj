from flask import Blueprint, jsonify, request, send_from_directory, current_app
import os
from dataclasses import asdict
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.Services.UserService import UserService
from app.WebAPI.validation.UserValidation import UserValidation
from app.Domain.enums.role import Role
from app.Middleware.role_required import role_required

user_bp = Blueprint("users", __name__)
user_service = UserService()

# CREATE
@user_bp.route("/register", methods=["POST"])
def create_user():
    data = request.get_json()

    error = UserValidation.validate_registration_data(data)
    if error:
        return error

    dto, status = user_service.create_user(data)
    if not dto:
        return jsonify({"error": "User already exists or invalid data"}), 400

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

    error = UserValidation.validate_profile_update_data(data)
    if error:
        return error

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

    error = UserValidation.validate_role_change(data)

    if error:
        return error

    new_role = Role(data["role"])

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

# UPLOAD IMAGE
@user_bp.route("/upload_image/<int:user_id>", methods=["POST"])
@jwt_required()
@role_required(Role.PLAYER, Role.MODERATOR)
def upload_profile_image(user_id):
    current_user_id = int(get_jwt_identity())
    if current_user_id != user_id:
        return jsonify({"error": "You can only upload your own profile image"}), 403

    if "image" not in request.files:
        return jsonify({"error": "No image file part"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    result, status = user_service.upload_profile_image(user_id, file)
    return jsonify(result), status

# DOHVAT ZA PRIKAZ NA UI
@user_bp.route("/profile-image/<int:user_id>", methods=["GET"])
def get_profile_image(user_id):
    dto, status = user_service.get_user_by_id(user_id)
    if not dto:
        return jsonify({"error": "User not found"}), status

    if not dto.profile_image:
        return jsonify({"error": "User has no profile image"}), 404

    file_path = dto.profile_image
    if not os.path.exists(file_path):
        return jsonify({"error": "Image file not found"}), 404

    return send_from_directory(
        current_app.config["UPLOAD_FOLDER"],
        os.path.basename(file_path)
    )