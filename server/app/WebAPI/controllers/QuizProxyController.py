import os
from io import BytesIO
from reportlab.pdfgen import canvas
from flask import Blueprint, request, jsonify
from app.Extensions.socketio_ext import socketio
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.Domain.models.User import User
from functools import wraps
import requests
from app.Database.db import db
from app.Domain.models.Result import Result
from app.Domain.enums.role import Role
from app.Extensions.email_sender import EmailSender



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
    user = User.query.get(current_user_id)

    user_answers = request.json #odgovori koje salje front
    user_answers['user_email'] = user.email

    try:
        quiz_service_res = requests.post(
            f"http://localhost:5001/api/quizzes/{quiz_id}/submit", 
            json=user_answers
        )

        if quiz_service_res.status_code != 202:
            return jsonify({
                "message": "Quiz successfully sent for processing. You can continue working."
            }), 202
        
        return quiz_service_res.text, quiz_service_res.status_code
    
    except Exception as e:
        return jsonify({"error": f"Failed to communicate with Quiz Service: {str(e)}"}), 500
        

@quiz_proxy_bp.route("/history", methods=["GET"])
@jwt_required()
def get_user_history():
    current_user_id = get_jwt_identity()

    results = Result.query.filter_by(user_id=current_user_id).order_by(Result.created_at.desc()).all()

    history_data = []
    for res in results:
        history_data.append({
            "id": res.id,
            "quiz_id": res.quiz_id,
            "quiz_title": res.quiz_title,
            "score": res.score,
            "total_questions": res.total_questions,
            "percentage": res.percentage,
            "time_spent": res.time_spent,
            "date": res.created_at.strftime("%Y-%m-%d %H:%M:%S")
        })

    return jsonify(history_data), 200

@quiz_proxy_bp.route("/internal/results", methods=["POST"])
def internal_save_result():
    token = request.headers.get("X-Internal-Token")
    if token != os.getenv("INTERNAL_API_KEY"):
        return jsonify({"message": "Unauthorized"}), 403

    data = request.get_json() or {}

    user_email = data.get("user_email")
    quiz_id = data.get("quiz_id")
    quiz_title = data.get("quiz_title")
    score = data.get("score")
    total_questions = data.get("total_questions")
    percentage = data.get("percentage")
    time_spent = data.get("time_spent")

    if not all([user_email, quiz_id, quiz_title]) or score is None or total_questions is None or percentage is None:
        return jsonify({"message": "Missing fields"}), 400

    user = User.query.filter_by(email=user_email).first()
    if not user:
        return jsonify({"message": "User not found"}), 404

    res = Result(
        user_id=user.id,
        quiz_id=str(quiz_id),
        quiz_title=str(quiz_title),
        score=int(score),
        total_questions=int(total_questions),
        percentage=float(percentage),
        time_spent=int(time_spent) if time_spent is not None else None
    )

    db.session.add(res)
    db.session.commit()

    return jsonify({"status": "saved"}), 200



@quiz_proxy_bp.route("/<quiz_id>/leaderboard", methods=["GET"])
@jwt_required()
def get_leaderboard(quiz_id):
    results = (
        Result.query
        .filter_by(quiz_id=str(quiz_id))
        .join(User, User.id == Result.user_id)
        .all()
    )

    results_sorted = sorted(
        results,
        key=lambda r: (-r.score, r.time_spent if r.time_spent is not None else 10**9)
    )

    return jsonify([
        {
            "user_id": r.user_id,
            "full_name": r.user.get_full_name(),
            "email": r.user.email,
            "score": r.score,
            "time_spent": r.time_spent
        }
        for r in results_sorted
    ]), 200


@quiz_proxy_bp.route("/<quiz_id>/report", methods=["GET"])
@jwt_required()
@admin_required
def send_quiz_report(quiz_id):
    admin_id = get_jwt_identity()
    admin = User.query.get(admin_id)

    results = (
        Result.query
        .filter_by(quiz_id=str(quiz_id))
        .join(User, User.id == Result.user_id)
        .all()
    )

    results_sorted = sorted(
        results,
        key=lambda r: (-r.score, r.time_spent if r.time_spent is not None else 10**9)
    )

    buffer = BytesIO()
    c = canvas.Canvas(buffer)
    c.setTitle(f"Quiz report {quiz_id}")

    y = 800
    c.drawString(50, y, f"Quiz report for quiz_id: {quiz_id}")
    y -= 25
    c.drawString(50, y, "Player (email) - Score - Time(s)")
    y -= 20

    for r in results_sorted:
        line = f"{r.user.get_full_name()} ({r.user.email}) - {r.score} - {r.time_spent if r.time_spent is not None else '-'}"
        c.drawString(50, y, line)
        y -= 16
        if y < 60:
            c.showPage()
            y = 800

    c.save()
    pdf_bytes = buffer.getvalue()
    buffer.close()

    EmailSender().send_pdf_report(
        to_email=admin.email,
        subject="Quiz PDF Report",
        body_html=f"<p>U prilogu je PDF izvještaj za kviz <b>{quiz_id}</b>.</p>",
        pdf_bytes=pdf_bytes,
        filename=f"quiz_{quiz_id}_report.pdf"
    )

    return jsonify({"status": "sent"}), 200

@quiz_proxy_bp.route("/<quiz_id>", methods=["GET"])
@jwt_required()
def get_quiz_details_proxy(quiz_id):
    try:
        response = requests.get(f"{QUIZ_SERVICE_URL}/{quiz_id}")
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": f"Could not reach Quiz Service: {str(e)}"}), 500