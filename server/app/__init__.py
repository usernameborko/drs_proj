from flask import Flask
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from app.Extensions.bcrypt import bcrypt
from app.config import Config
from app.WebAPI.controllers.AuthController import auth_bp

jwt = JWTManager()

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    CORS(app)
    jwt.init_app(app)
    bcrypt.init_app(app)

    app.register_blueprint(auth_bp, url_prefix="/api/auth")

    return app