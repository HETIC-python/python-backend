from sqlalchemy import create_engine
import pymysql
from os import environ
from dotenv import load_dotenv
load_dotenv("./.env")

USER_NAME = environ.get("DB_USER_NAME")
USER_PASS = environ.get("DB_USER_PASS")
HOST = environ.get("DB_HOST")
DB_NAME = environ.get("DB_NAME")
DATABASE_URI = f"mysql+pymysql://{USER_NAME}:{USER_PASS}@{HOST}/{DB_NAME}"



def db_connect():
    try:
        engine = create_engine(DATABASE_URI)
        connection = engine.connect()
        print("Database connection successful!")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__name__":
    db_connect()