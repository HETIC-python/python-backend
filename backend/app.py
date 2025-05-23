from flask import Flask
from flask_migrate import Migrate
from config import DATABASE_URI
from models import db
from routes.cars import cars_bp
from routes.service import service_bp
from routes.request  import request_bp
from routes.user import user_bp
from routes.upload import upload_bp
from routes.rag import rag_bp
from models.user import User
from models.car import Car
from models.carAppointment import CarAppointment
from routes.carAppointments import car_appointment_bp
from models.request import Request
from models.appointment import Appointment
from routes.appointments import appointment_bp
from flask_login import LoginManager
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from controller.service import (
    create_service,
    get_service,
    get_all_services,
    update_service,
    delete_service,
)
from flask_cors import CORS

app = Flask(__name__)
app.config["JWT_SECRET_KEY"] = "123ciseau" 
jwt = JWTManager(app)

CORS(app)

app.config["SQLALCHEMY_DATABASE_URI"] = DATABASE_URI
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

db.init_app(app)
migrate = Migrate(app, db)

login_manager = LoginManager()
login_manager.init_app(app)

# Enregistrer le Blueprint

app.register_blueprint(cars_bp, url_prefix="/api")
app.register_blueprint(service_bp, url_prefix="/api")
app.register_blueprint(request_bp, url_prefix="/api")
app.register_blueprint(appointment_bp, url_prefix="/api")
app.register_blueprint(car_appointment_bp, url_prefix="/api")
app.register_blueprint(user_bp, url_prefix="/api")
app.register_blueprint(upload_bp,url_prefix="/api")
app.register_blueprint(rag_bp,url_prefix="/api")


if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)

