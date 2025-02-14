from flask import Flask, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from dotenv import PASSWORD # Get the real dotenv variable 

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///.db' #TODO Put the real db name 
app.config['JWT_SECRET_KEY'] = PASSWORD

db = SQLAlchemy(app)
jwt = JWTManager(app)

class User(db.Model):
    # User SQLA TODO: Make the real DB model But man I am not motivated 
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(256), nullable=False)

@app.route('/register', methods=['POST'])
def register():
    # Registers the new user TODO : IDK
    data = request.get_json()
    hashed_password = generate_password_hash(data['password'], method='pbkdf2:sha256')
    new_user = User(username=data['username'], email=data['email'], password=hashed_password)
    
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({'message': 'User registered successfully!'}), 201

@app.route('/login', methods=['POST'])
def login():
    # Logs the user in, wow. TODO : IDK
    data = request.get_json()
    user = User.query.filter_by(email=data['email']).first()
    
    if user and check_password_hash(user.password, data['password']):
        access_token = create_access_token(identity={'id': user.id, 'username': user.username})
        return jsonify({'token': access_token}), 200
    
    return jsonify({'message': 'Invalid credentials'}), 401

@app.route('/profile', methods=['GET'])
@jwt_required()
def profile():
    # Gets user profile TODO : More stuff like a clean get and DB call 
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
    #Dummy for now : TODO : Make Orders actually make something
    pass

if __name__ == '__main__':
    db.create_all()
    app.run(debug=True)
