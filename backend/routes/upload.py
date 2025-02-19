from flask import Blueprint, request, jsonify
from services.s3_service import upload_file_to_s3

upload_bp = Blueprint("upload", __name__)

@upload_bp.route("/upload", methods=["POST"])
def upload_file():
    if "file" not in request.files:
        return jsonify({"error": "Aucun fichier trouvé"}), 400

    file = request.files["file"]
    try:
        file_url = upload_file_to_s3(file)
        return jsonify({"message": "Upload réussi", "url": file_url}), 200
    except ValueError as e:
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        return jsonify({"error": "Une erreur est survenue", "details": str(e)}), 500
