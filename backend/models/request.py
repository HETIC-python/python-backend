from . import db
from datetime import datetime

class Request(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.Enum('rent', 'buy', 'trade-in'), nullable=False)
    status = db.Column(db.Enum('new', 'pending', 'on-processing','done'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    car_id = db.Column(db.Integer, db.ForeignKey('car.id'), nullable=False)
    start_date = db.Column(db.Date, nullable=False)
    end_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    price = db.Column(db.Numeric(10, 2))
    description = db.Column(db.Text)