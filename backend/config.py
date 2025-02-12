from os import environ

from dotenv import load_dotenv

load_dotenv("./.env")

USER_NAME = environ.get("DB_USER_NAME")
USER_PASS = environ.get("DB_USER_PASS")
HOST = environ.get("DB_HOST")
DB_NAME = environ.get("DB_NAME")
DATABASE_URI = f"mysql+pymysql://{USER_NAME}:{USER_PASS}@{HOST}/{DB_NAME}"


# app = Flask(__name__)
#
# app.config['SQLALCHEMY_DATABASE_URI'] =DATABASE_URI
# app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#
# db = SQLAlchemy(app)
