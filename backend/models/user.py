from . import db

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    firstname = db.Column(db.String(255))
    lastname = db.Column(db.String(255))
<<<<<<< HEAD
=======
    email = db.Column(db.String(255))
>>>>>>> cbf21ba2681cf7e2d223caa71efd1400c420fa92
    password = db.Column(db.String(255))
    role = db.Column(db.String(50))
    birthdate = db.Column(db.Date)
    city = db.Column(db.String(255))
    adresse = db.Column(db.String(255))
    zipcode = db.Column(db.String(10))
    job = db.Column(db.String(255))
    income = db.Column(db.Numeric(10, 2))