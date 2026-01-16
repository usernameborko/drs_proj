from flask import Blueprint, jsonify, request
from app.Database.db import db
from app.Domain.models.User import User

db_test_bp = Blueprint("db_test", __name__)

@db_test_bp.route("/ping", methods=["GET"])
def ping_db():
    db.session.execute(db.text("SELECT 1"))
    return jsonify({"db": "ok"}), 200

@db_test_bp.route("/users", methods=["GET"])
def list_users():
    users = User.query.all()
    return jsonify([{"id": u.id, "email": u.email, "role": u.role} for u in users]), 200

@db_test_bp.route("/seed-user", methods=["POST"])
def seed_user():
    data = request.get_json() or {}
    email = data.get("email", "seed@test.com")
    role = data.get("role", "PLAYER")

    if User.query.filter_by(email=email).first():
        return jsonify({"message": "User already exists"}), 409

    u = User(email=email, password_hash="TEMP_HASH", role=role)
    db.session.add(u)
    db.session.commit()

    return jsonify({"message": "Created", "id": u.id}), 201