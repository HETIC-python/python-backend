from flask import Flask
import mysql.connector

app = Flask(__name__)

# Configuration de la base de données
db_config = {
    'host': 'mysql-dbbackend.alwaysdata.net',
    'user': 'dbbackend',
    'password': 'dbbackend123@',
    'database': 'dbbackend_123'
}

try:
    connection = mysql.connector.connect(**db_config)
    if connection.is_connected():
        print("Connexion réussie à la base de données")
except mysql.connector.Error as err:
    print(f"Erreur de connexion : {err}")

@app.route("/")
def home():
    return "Hello, Flask is connected to InfinityFree DB!"

if __name__ == "__main__":
    app.run(debug=True)
