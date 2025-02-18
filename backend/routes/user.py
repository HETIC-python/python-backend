from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy

from werkzeug.security import generate_password_hash, check_password_hash

from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

from models import db
from models.user import User
from models.request import Request


app = Flask(__name__)
jwt = JWTManager(app)

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(firstname=data['firstname'],lastname=data['lastname'],role=data['role'],birthdate=data['birthdate'],city=data['city'],adresse=data['adresse'],zipcode=data['zipcode'],job=data['job'],income=data['income'], email=data['email'], password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'id': user.id, 'username': user.username})
        return jsonify({'token': access_token}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    
    return jsonify({
        'id': user.id,
        'username': user.username,
        'email': user.email
    })

@app.route('/orders', methods=['GET'])
@jwt_required()
def orders():
    #Dummy for now : TODO : Make Orders actually display something
    
@app.route('order_car',methods=['POST'])
jwt_required()
def order_car(): 
    data = request.get_json()
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])
    car = data['id']
    new_request = Request(type=data['type'], user_id=user,car_id=car,start_date=data['start_date'],end_date=data['end_date'],created_at=data['created_at'],price=data['price'],description=data['description'])
    
if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
