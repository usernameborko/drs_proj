from flask import Blueprint, request, jsonify
from app.Extensions.socketio_ext import socketio
import requests
import os

quiz_proxy_bp = Blueprint("quiz_proxy", __name__)

QUIZ_SERVICE_URL = "http://localhost:5001/api/quizzes"

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
@quiz_proxy_bp.route("/<quiz_id>/review", methods=["PATCH"])
def review_quiz(quiz_id):
    data = request.json

    try:
        response = requests.patch(f"{QUIZ_SERVICE_URL}/{quiz_id}/status", json=data)
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": f"Could not reach Quiz Service: {str(e)}"}), 500
    

#dobijanje svih kvizova (samo admin)
@quiz_proxy_bp.route("/", methods=["GET"])
def get_all_quizzes_proxy():
    try:
        response = requests.get(f"{QUIZ_SERVICE_URL}")
        return (response.text, response.status_code, response.headers.items())
    except Exception as e:
        return jsonify({"error": f"Could not reach Quiz Service: {str(e)}"}), 500