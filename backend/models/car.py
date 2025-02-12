
from . import db

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