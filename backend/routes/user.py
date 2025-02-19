from flask import Flask, request, jsonify, make_response, Blueprint

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from datetime import datetime

from models import db
from models.user import User
from models.request import Request
from models.appointment import Appointment

app = Flask(__name__)
jwt = JWTManager(app)
user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    try : 
        data = request.get_json()
        print(data)
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(firstname=data['firstname'],lastname=data['lastname'],role="user",birthdate=data['birthdate'],city=data['city'],adresse=data['adresse'],zipcode=data['zipcode'],job=data['job'],income=data['income'], email=data['email'], password=hashed_password)
        
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({'success' : True, 'message': 'User registered successfully!'}), 201
    except :
        return jsonify({'success' : False, 'message': 'Error occured!'}), 500

@user_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'id': user.id, 'username': user.username})
        return jsonify({'token': access_token}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })

@user_bp.route('/orders', methods=['GET'])
@jwt_required()
def orders():
    #Dummy for now : TODO : Make Orders actually display something
    pass
    
@user_bp.route('order_car',methods=['POST'])
@jwt_required()
def order_car(): 
    try:
        data = request.get_json()
        current_user = get_jwt_identity()
        user = User.query.get(current_user['id'])
        
        if not user:
            return jsonify({'error': 'User not found'}), 404
        
        car_id = data.get('id')
        service_id = data.get('service_id')
        start_date = datetime.strptime(data.get('start_date'), '%Y-%m-%d')
        end_date = datetime.strptime(data.get('end_date'), '%Y-%m-%d')
        created_at = datetime.now()
        
        new_request = Request(
            type=data.get('type'),
            user_id=user.id,
            car_id=car_id,
            start_date=start_date,
            end_date=end_date,
            created_at=created_at,
            price=data.get('price'),
            description=data.get('description')
        )
        db.session.add(new_request)
        db.session.commit()
        
        new_appointment = Appointment(
            user_id=user.id,
            service_id=service_id,
            date=start_date,
            created_at=created_at
        )
        db.session.add(new_appointment)
        db.session.commit()
        
        return jsonify({'message': 'Car order placed successfully', 'request_id': new_request.id, 'appointment_id': new_appointment.id}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
