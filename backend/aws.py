import os

class Config:
    AWS_ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
    AWS_SECRET_KEY = os.getenv("AWS_SECRET_KEY")
    AWS_BUCKET_NAME = "hetic-group1-python"
    AWS_REGION = "eu-west-3"  # Change selon ta région
