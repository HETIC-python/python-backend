import boto3
import os
from werkzeug.utils import secure_filename
from aws import Config

s3_client = boto3.client(
    "s3",
    aws_access_key_id=Config.AWS_ACCESS_KEY,
    aws_secret_access_key=Config.AWS_SECRET_KEY,
    region_name=Config.AWS_REGION
)

def upload_file_to_s3(file, bucket_name=Config.AWS_BUCKET_NAME):
    """
    Upload un fichier PDF sur S3 et retourne l'URL.
    """
    if not file:
        return None

    filename = secure_filename(file.filename)
    # if not filename.lower().endswith(".pdf"):
    #     raise ValueError("Seuls les fichiers PDF sont autorisés")

    s3_path = f"uploads/{filename}"  # Dossier "uploads/" dans S3
    content_type = file.content_type if hasattr(file, 'content_type') else 'application/octet-stream'
    s3_client.upload_fileobj(file, bucket_name, s3_path, ExtraArgs={"ContentType": content_type})

    file_url = f"https://{bucket_name}.s3.{Config.AWS_REGION}.amazonaws.com/{s3_path}"
    return file_url
