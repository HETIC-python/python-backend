from flask import Flask, request, jsonify, make_response, Blueprint

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from utils.admin import admin_checking

from datetime import datetime, timedelta

from models import db
from models.user import User
from models.request import Request
from models.appointment import Appointment

user_bp = Blueprint('users', __name__)

@user_bp.route('/register', methods=['POST'])
def register():
    try : 
        data = request.get_json()
        hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
        new_user = User(firstname=data['firstname'],lastname=data['lastname'],role="user",birthdate=data['birthdate'],city=data['address']['city'],adresse=f"{data['address']['street']} {data['address']['city']} {data['address']['zipCode']}, {data['address']['country']}",zipcode=data['address']['zipCode'],job=data['job'],income=data['income'], email=data['email'], password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
    
        return jsonify({'success' : True, 'message': 'User registered successfully!'}), 201
    except :
        return jsonify({'success' : False, 'message': 'Error occurred!'}), 500

@user_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        user = User.query.filter_by(email=data['email']).first()
        
        if user and check_password_hash(user.password, data['password']):
            access_token = create_access_token(

                identity=str(user.id),  # MUST be string
                additional_claims={
                    'is_admin': user.role == 'admin',
                    'email': user.email,
                    'role': user.role
                },
                expires_delta=timedelta(days=100)
            )
            return jsonify({
                "success": True,
                'token': access_token,
                'is_admin': user.role == 'admin'
            }), 200
        
        return jsonify({"success": False, 'message': 'Invalid credentials'}), 401
    except Exception as e:
        print("Login error:", str(e))
        return jsonify({"success": False, 'message': 'Server error'}), 500

@user_bp.route('/profile', methods=['GET'])
# @admin_checking
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get(str(current_user))
    return jsonify({
        'id': user.id,
        'firstname': user.firstname,
        'lastname': user.lastname,
        'role': user.role,
        'birthdate': user.birthdate,
        'city': user.city,
        'adresse': user.adresse,
        'zipcode': user.zipcode,
        'job': user.job,
        'income': user.income
    })
@user_bp.route('/orders', methods=['GET'])
@jwt_required()
def orders():
    #Dummy for now : TODO : Make Orders actually display something
    pass

@user_bp.route('order_car',methods=['POST'])
@jwt_required()
@admin_checking
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
        created_at = datetime.now() # TODO ¨now¨, A enlever si ca cause des problemes
        
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
        
        return jsonify({'message': 'Car order placed successfully', 'request_id': new_request.id, 'appointment_id': new_appointment.id}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)

@user_bp.route('/users', methods=['GET'])
@jwt_required()
@admin_checking
def get_users():
    try:
        users = User.query.all()
        users_list = [{
            'id': user.id,
            'email': user.email,
            'firstname': user.firstname,
            'lastname': user.lastname,
            'role': user.role,
            'adresse': user.adresse,
            'zipcode': user.zipcode,
            'job': user.job,
            'income': user.income
        } for user in users]
        
        return jsonify({
            'success': True,
            'data': users_list
        }), 200

    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500
