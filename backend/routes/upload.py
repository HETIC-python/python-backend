from flask import Blueprint, request, jsonify
from service.s3_service import upload_file_to_s3
from service.s3_service import get_file_from_s3

from service.document_parser import extract_text

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


@upload_bp.route('/extract', methods=['POST'])
def extract_text_api():
    key = request.json.get('key')
    if not key:
        return jsonify({'error': 'Missing key'}), 400

    try:
        file_path = get_file_from_s3(key)
        ext = file_path.split('.')[-1].lower()
        text = extract_text(file_path, ext)
        return jsonify({'text': text[:1000]})
    except Exception as e:
        return jsonify({'error': str(e)}), 500