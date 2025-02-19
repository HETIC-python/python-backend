from datetime import datetime
from . import db  

class CarAppointment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    car = db.relationship("Car", backref="carAppointment")