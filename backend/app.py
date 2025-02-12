from flask import Flask
from flask_migrate import Migrate
from config import DATABASE_URI
from models import db
from routes.cars import cars_bp
from models.user import User
from models.car import Car
from models.request import Request
from models.service import Service
from models.appointment import Appointment
from flask_login import LoginManager
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from config import Config
from backend.controller.service import create_service, get_service, get_all_services, update_service, delete_service

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.get("/api/services")
def list_services():
    services = get_all_services()
    return jsonify([{
        "id": service.id,
        "name": service.name,
        "description": service.description
    } for service in services])

@app.get("/api/services/<int:service_id>")
def get_single_service(service_id):
    service = get_service(service_id)
    if service:
        return jsonify({
            "id": service.id,
            "name": service.name,
            "description": service.description
        })
    return jsonify({"message": "Service non trouvé"}), 404

@app.post("/api/services")
def add_service():
    data = request.get_json()
    if not data or "name" not in data or "description" not in data:
        return jsonify({"message": "Les champs 'name' et 'description' sont requis"}), 400
    
    service = create_service(data["name"], data["description"])
    return jsonify({
        "id": service.id,
        "name": service.name,
        "description": service.description
    }), 201

@app.put("/api/services/<int:service_id>")
def modify_service(service_id):
    data = request.get_json()
    if not data:
        return jsonify({"message": "Données invalides"}), 400
    
    service = update_service(
        service_id,
        name=data.get("name"),
        description=data.get("description")
    )
    
    if service:
        return jsonify({
            "id": service.id,
            "name": service.name,
            "description": service.description
        })
    return jsonify({"message": "Service non trouvé"}), 404

@app.delete("/api/services/<int:service_id>")
def remove_service(service_id):
    if delete_service(service_id):
        return jsonify({"message": "Service supprimé"})
    return jsonify({"message": "Service non trouvé"}), 404

@app.get("/")
def index():
    return "Database connected successfully!"

login_manager = LoginManager()
login_manager.init_app(app)

# Enregistrer le Blueprint

app.register_blueprint(cars_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True)