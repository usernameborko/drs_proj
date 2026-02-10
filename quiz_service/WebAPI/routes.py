from flask import Blueprint, request, jsonify
from Database.database import db_mongo
from Domain.DTOs.dtos import QuizDTO, QuestionDTO
import requests
import os

quiz_db = Blueprint("quiz_db", __name__)
collection = db_mongo.get_collection("quizzes")

#kreirnaje kviza (moderatro)
@quiz_db.route("/", methods=["POST"])
def create_quiz():
    data = request.json

    #mapirati pitanja iz req u QuestionDTO 
    questions = []
    for q in data.get('questions', []):
        questions.append(QuestionDTO(
            text = q['text'],
            options = q['options'],
            correct_answers = q['correct_answers'],
            points = q['points']
        ))

    #kreiranje QuizDTOa
    new_quiz = QuizDTO(
        title = data['title'],
        author_id = data['author_id'],
        duration = data['duration'],
        questions = questions
    )

    #cuvanje u MongoDB
    quiz_dict = new_quiz.to_disc()
    result = collection.insert_one(quiz_dict)

    #poruka serveru
    try:
        main_server_url = os.getenv("MAIN_SERVER_URL")
        requests.post(f"{main_server_url}/api/quizzes/notify-admin", json={
            "quiz_id": str(result.inserted_id),
            "title": new_quiz.title
        })
    except Exception as e:
        print(f"Greska pri slanju obavjestenja serveru: {e}")

    return jsonify({"message": "Quiz created and pending approval", "id": str(result.inserted_id)}), 201

#promjena statusa kviza
@quiz_db.route("/<quiz_id>/status", methods=["PATCH"])
def update_quiz_status(quiz_id):
    from bson import ObjectId

    data = request.json
    new_status = data.get("status") #approved ili rejected
    reason = data.get("rejection_reason", "")

    update_data = {"status": new_status}
    if new_status == "REJECTED":
        update_data["rejection_reason"] = reason

    result = collection.update_one(
        {"_id": ObjectId(quiz_id)},
        {"$set": update_data}
    )

    if result.matched_count == 0:
        return jsonify({"message": "Quiz not found"}), 404
    
    return jsonify({"message": f"Quiz status updated to {new_status}"}), 200

#listanje svih kvizova
@quiz_db.route("/", methods=["GET"])
def get_quizzes():
    quizzes = list(collection.find())
    for q in quizzes:
        q['_id'] = str(q['_id'])
    return jsonify(quizzes), 200