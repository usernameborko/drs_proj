import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

class MongoDatabase:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client[os.getenv("DB_NAME")]
    
    def get_collection(self, name):
        return self.db[name]

db_mongo = MongoDatabase()

