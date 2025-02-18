from flask import Flask
from flask_migrate import Migrate
from config import DATABASE_URI
from models import db
from routes.cars import cars_bp
from routes.service import service_bp
from models.user import User
from models.car import Car
from models.carAppointment import CarAppointment
from models.request import Request
from models.appointment import Appointment
from routes.appointments import appointment_bp
from flask_login import LoginManager
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from controller.service import (
    create_service,
    get_service,
    get_all_services,
    update_service,
    delete_service,
)
from flask_cors import CORS

app = Flask(__name__)
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
app.register_blueprint(appointment_bp, url_prefix="/api")

if __name__ == "__main__":
    # app.run(debug=True)
    app.run(host='0.0.0.0', port=5000)

