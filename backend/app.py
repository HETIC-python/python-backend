from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from config import DATABASE_URI
from flask_migrate import Migrate
from datetime import datetime

app = Flask(__name__)
# app.config.from_object(Config)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

migrate = Migrate(app, db)



class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
    role = db.Column(db.String(50))
    birthdate = db.Column(db.Date)
    city = db.Column(db.String(255))
    adresse = db.Column(db.String(255))
    zipcode = db.Column(db.String(10))
    job = db.Column(db.String(255))
    income = db.Column(db.Numeric(10, 2))

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    year = db.Column(db.Integer)
    model = db.Column(db.String(255))
    brand = db.Column(db.String(255))
    km = db.Column(db.Integer)
    type = db.Column(db.String(50))
    code = db.Column(db.String(50))
    availability = db.Column(db.Boolean)
    description = db.Column(db.Text)

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum('rent', 'buy', 'trade-in'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    price = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)

class Service(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255))
    description = db.Column(db.Text)

class Appointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    service_id = db.Column(db.Integer, db.ForeignKey('service.id'), nullable=False)
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)



@app.route("/")
def index():
    return "Database connected successfully!"

if __name__ == "__main__":
    app.run(debug=True)