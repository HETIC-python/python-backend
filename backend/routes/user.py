from flask import Flask
from flask_migrate import Migrate
from config import DATABASE_URI
from models import db
from models.user import User
