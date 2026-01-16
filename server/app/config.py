import os
from dotenv import load_dotenv
from urllib.parse import quote_plus

BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ENV_PATH = os.path.join(BASE_DIR, ".env")

load_dotenv()

class Config:
    SECRET_KEY = "secretkey"
    JWT_SECRET_KEY = "jwtsecretkey"

    DB_HOST = os.getenv("DB_HOST", "localhost")
    DB_PORT = os.getenv("DB_PORT", "3306")
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "")
    DB_PASSWORD_ENC = quote_plus(DB_PASSWORD)
    DB_NAME = os.getenv("DB_NAME", "drs_db")

    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False