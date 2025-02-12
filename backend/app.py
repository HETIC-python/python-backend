from flask import Flask
from flask_migrate import Migrate
from config import DATABASE_URI
from models import db
from routes.cars import cars_bp
from models.user import User
from models.car import Car
from models.request import Request
from models.service import Service
from models.appointment import Appointment
from flask_login import LoginManager

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = DATABASE_URI
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

@app.route("/")
def index():
    return "Database connected successfully!"

login_manager = LoginManager()
login_manager.init_app(app)

# Enregistrer le Blueprint

app.register_blueprint(cars_bp, url_prefix='/api')

if __name__ == "__main__":
    app.run(debug=True)