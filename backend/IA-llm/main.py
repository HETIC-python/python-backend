import upload
from get_cloud_docs import get_cloud_docs
import sys
import os
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))
from service.s3_service import list_files_in_s3
from aws import Config
def main():
        files = list_files_in_s3("uploads/")
        for file in files :
            try :
                file_name = get_cloud_docs(f"https://{Config.AWS_BUCKET_NAME}.s3.{Config.AWS_REGION}.amazonaws.com/{file}")
                if file_name.endswith(".pdf"):
                    upload.convert_pdf_to_text(file_name)
                else:
                    print("File type not supported.")
                os.remove(file_name)

            except Exception as e:
                print(e)


if __name__ == "__main__":
    main()  