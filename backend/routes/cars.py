from flask import Flask, request, jsonify, make_response, Blueprint
from models import db  # Assurez-vous que votre module db est bien importé

from models.car import Car  # Importation de votre classe Car


cars_bp = Blueprint('cars', __name__)




# Créer une voiture (POST)
@cars_bp.route('/cars', methods=['POST'])
def create_car():
    try:
        data = request.get_json()
        new_car = Car(
            name=data['name'],
            year=data['year'],
            model=data['model'],
            brand=data['brand'],
            km=data['km'],
            type=data['type'],
            code=data['code'],
            availability=data['availability'],
            description=data['description']
        )
        db.session.add(new_car)
        db.session.commit()
        return make_response(jsonify({"message": "Car created successfully", "car_id": new_car.id}), 201)
    except Exception as e:
        return make_response(jsonify({"message": f"Error creating car: {str(e)}"}), 500)


# Lire toutes les voitures (GET)
@cars_bp.route('/cars', methods=['GET'])
def get_all_cars():
    cars = Car.query.all()
    result = [
        {
            "id": car.id,
            "name": car.name,
            "year": car.year,
            "model": car.model,
            "brand": car.brand,
            "km": car.km,
            "type": car.type,
            "code": car.code,
            "availability": car.availability,
            "description": car.description
        } for car in cars
    ]
    return jsonify(result)


# Lire une voiture spécifique par ID (GET)
@cars_bp.route('/cars/<int:car_id>', methods=['GET'])
def get_car(car_id):
    car = Car.query.get(car_id)
    if not car:
        return make_response(jsonify({"message": "Car not found"}), 404)
    result = {
        "id": car.id,
        "name": car.name,
        "year": car.year,
        "model": car.model,
        "brand": car.brand,
        "km": car.km,
        "type": car.type,
        "code": car.code,
        "availability": car.availability,
        "description": car.description
    }
    return jsonify(result)


# Mettre à jour une voiture (PUT)
@cars_bp.route('/cars/<int:car_id>', methods=['PUT'])
def update_car(car_id):
    try:
        car = Car.query.get(car_id)
        if not car:
            return make_response(jsonify({"message": "Car not found"}), 404)

        data = request.get_json()
        car.name = data.get('name', car.name)
        car.year = data.get('year', car.year)
        car.model = data.get('model', car.model)
        car.brand = data.get('brand', car.brand)
        car.km = data.get('km', car.km)
        car.type = data.get('type', car.type)
        car.code = data.get('code', car.code)
        car.availability = data.get('availability', car.availability)
        car.description = data.get('description', car.description)

        db.session.commit()
        return make_response(jsonify({"message": "Car updated successfully"}), 200)
    except Exception as e:
        return make_response(jsonify({"message": f"Error updating car: {str(e)}"}), 500)


# Supprimer une voiture (DELETE)
@cars_bp.route('/cars/<int:car_id>', methods=['DELETE'])
def delete_car(car_id):
    try:
        car = Car.query.get(car_id)
        if not car:
            return make_response(jsonify({"message": "Car not found"}), 404)

        db.session.delete(car)
        db.session.commit()
        return make_response(jsonify({"message": "Car deleted successfully"}), 200)
    except Exception as e:
        return make_response(jsonify({"message": f"Error deleting car: {str(e)}"}), 500)
