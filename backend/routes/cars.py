from flask import request, jsonify, make_response, Blueprint
from service.s3_service import upload_file_to_s3
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
            description=data['description'],
            price=data['price'],
            # picture=data['picture'],
            engine=data['engine'],
            transmission=data['transmission'],
            horsepower=data['horsepower'],
            topSpeed=data['topSpeed']
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
            "description": car.description,
            "price": car.price,
        "picture": car.picture,
        "engine": car.engine,
        "transmission": car.transmission,
        "horsepower": car.horsepower,
        "topSpeed": car.topSpeed
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
        "description": car.description,
        "price": car.price,
        "picture": car.picture,
        "engine": car.engine,
        "transmission": car.transmission,
        "horsepower": car.horsepower,
        "topSpeed": car.topSpeed

        
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
        car.price = data.get('price', car.price)
        car.picture = data.get('picture', car.picture)
        car.engine = data.get('engine', car.engine)
        car.transmission = data.get('transmission', car.transmission)
        car.horsepower = data.get('horsepower', car.horsepower)
        car.topSpeed = data.get('topSpeed', car.topSpeed)

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



@cars_bp.route("/cars/upload/<int:car_id>", methods=["POST"])
def upload_file(car_id):
    if "file" not in request.files:
        return jsonify({"error": "No file found"}), 400
    
    file = request.files["file"]
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    try:
        # Upload to S3 and get the URL
        file_url = upload_file_to_s3(file)
        
        # Update the car's picture URL in the database
        car = Car.query.get(car_id)
        if car:
            car.picture = file_url
            db.session.commit()
        
        return jsonify({
            "message": "File uploaded successfully",
            "url": file_url
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
