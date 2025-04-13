import boto3
import os
import tempfile

from werkzeug.utils import secure_filename
from aws import Config
from service import document_parser

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

def list_files_in_s3(folder="documents/"):
    response = s3_client.list_objects_v2(Bucket=Config.AWS_BUCKET_NAME, Prefix=folder)
    return [item['Key'] for item in response.get('Contents', [])]

def delete_file_from_s3(key):
    s3_client.delete_object(Bucket=Config.AWS_BUCKET_NAME, Key=key)
    return True

def get_file_from_s3(file_name):
    temp_path = f"tmp/{os.path.basename(file_name)}"
    s3_client.download_file(Config.AWS_BUCKET_NAME, file_name, temp_path)
    return temp_path

def get_txt_file_from_s3 (file_name) : 
    if file_name.endswith(".txt") or file_name.endswith(".json") or file_name.endswith(".pdf"):
        file_path = get_file_from_s3(file_name)
        ext = file_path.split('.')[-1].lower()
        txt = document_parser.extract_text(file_path, ext)
        tmp_dir = os.path.join(os.getcwd(), "tmp")
        os.makedirs(tmp_dir, exist_ok=True)
        temp = tempfile.NamedTemporaryFile(
            delete=False,
            suffix=".txt",
            mode="w",
            encoding="utf-8",
            dir=tmp_dir
        )        
        temp.write(txt)
        temp.close()
        os.remove(file_path)

        return temp.name