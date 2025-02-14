from . import db  

class Car(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    year = db.Column(db.Integer)
    model = db.Column(db.String(255))
    brand = db.Column(db.String(255))
    km = db.Column(db.Integer)
    type = db.Column(db.String(50))
    code = db.Column(db.String(50))
    engine = db.Column(db.String(255))  
    transmission = db.Column(db.String(50)) 
    horsepower = db.Column(db.Integer)  
    topSpeed = db.Column(db.Integer) 
    availability = db.Column(db.Boolean, default=True)
    description = db.Column(db.Text)
    picture = db.Column(db.String(255))  #
