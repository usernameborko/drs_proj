from flask import Blueprint, request, jsonify
from app.Extensions.socketio_ext import socketio

quiz_proxy_bp = Blueprint("quiz_proxy", __name__)

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