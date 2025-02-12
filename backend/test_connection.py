from sqlalchemy import create_engine

DATABASE_URI = "mysql+pymysql://dbbackend:dbbackend_123@mysql-dbbackend.alwaysdata.net/dbbackend_123"

try:
    engine = create_engine(DATABASE_URI)
    connection = engine.connect()
    print("Database connection successful!")
except Exception as e:
    print(f"Error: {e}")
