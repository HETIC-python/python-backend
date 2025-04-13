import os
from dotenv import load_dotenv
from pathlib import Path

# Obtenir le chemin absolu du répertoire contenant aws.py
base_dir = Path(__file__).resolve().parent
# Charger le .env depuis le répertoire backend
env_path = base_dir / '.env'

load_dotenv(env_path)

class Config:
    AWS_ACCESS_KEY = os.environ.get("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.environ.get("AWS_SECRET_KEY")
    AWS_BUCKET_NAME = "hetic-group1-python"
    AWS_REGION = "eu-west-3"  # Change selon ta région
