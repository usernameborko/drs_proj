from flask import Blueprint, request, jsonify
from app.Extensions.socketio_ext import socketio
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Domain.models.User import User
from functools import wraps
import requests
from app.Database.db import db
from app.Domain.models.Result import Result



quiz_proxy_bp = Blueprint("quiz_proxy", __name__)
QUIZ_SERVICE_URL = "http://localhost:5001/api/quizzes"

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        if not user or user.role != 'ADMIN':
            return jsonify({"msg": "Only Admin can perform this action"}), 403
        return f(*args, **kwargs)
    return decorated_function

@quiz_proxy_bp.route("/notify-admin", methods=["POST"])
def notify_admin():
    data = request.json
    quiz_title = data.get("title")
    quiz_id = data.get("quiz_id")

    #prikazivanje svim povezanim klijentima
    socketio.emit('new_quiz_created', {
        'message': f"Novi kviz '{quiz_title}' ceka na odobrenje",
        'quiz_id': quiz_id
    })

    return jsonify({"status": "Admin notified via WrbSocket"}), 200

#odobravanje i odbijanje
@quiz_proxy_bp.route("/<quiz_id>/review", methods=["PATCH"], endpoint="review_quiz_patch")
@jwt_required()
@admin_required
def review_quiz(quiz_id):
    data = request.json

    try:
        response = requests.patch(f"{QUIZ_SERVICE_URL}/{quiz_id}/status", json=data)
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": f"Could not reach Quiz Service: {str(e)}"}), 500
    

#dobijanje svih kvizova (samo admin)
@quiz_proxy_bp.route("/", methods=["GET"], endpoint="get_quizzes")
@jwt_required()
def get_all_quizzes_proxy():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    if not user or user.role not in ['ADMIN', 'MODERATOR']:
        return jsonify({"msg": "Unauthorized"}), 403
    
    try:
        response = requests.get(f"{QUIZ_SERVICE_URL}")
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": f"Could not reach Quiz Service: {str(e)}"}), 500
    

@quiz_proxy_bp.route("/<quiz_id>/submit", methods=["POST"])
@jwt_required()
def submit_and_save_result(quiz_id):
    current_user_id = get_jwt_identity()
    user_answers = request.json #odgovori koje salje front

    try:
        quiz_service_res = requests.post(
            f"http://localhost:5001/api/quizzes/{quiz_id}/submit", json=user_answers
        )

        if quiz_service_res.status_code != 200:
            return quiz_service_res.text, quiz_service_res.status_code
        
        result_data = quiz_service_res.json()

        new_result = Result(
            user_id = current_user_id,
            quiz_id = quiz_id,
            quiz_title = result_data['quiz_title'],
            score = result_data['correct_questions'],
            total_questions = result_data['total_questions'],
            percentage = result_data['percentage']
        )

        db.session.add(new_result)
        db.session.commit()

        return jsonify({
            "message": "Result saved successfully",
            "details": result_data
        }), 200
    
    except Exception as e:
        return jsonify({"error": f"Failed to process quiz: {str(e)}"}), 500