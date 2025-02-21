from flask import Blueprint, request, jsonify
from datetime import datetime
from controller.request import (
    create_request,
    get_request,
    get_all_requests,
    get_user_requests,
    get_car_requests,
    update_request,
    delete_request
)
from models.user import User
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity

request_bp = Blueprint('requests', __name__)

@request_bp.get("/requests")
@jwt_required()
def list_requests():
    current_user = get_jwt_identity()
    user = User.query.get(str(current_user))

    car_id = request.args.get('car_id', type=int)
    
    if user.role == "admin":
        requests = get_all_requests()
    elif car_id:
        requests = get_car_requests(car_id)
    else:
        requests = get_user_requests(user.id)

    return jsonify({
        "success": True,
        "data": [{
            "id": req.id,
            "type": req.type,
            "description": req.description,
            "status": req.status,
            "user_id": req.user_id,
            "car_id": req.car_id,
            "start_date": req.start_date.isoformat() if req.start_date else None,
            "end_date": req.end_date.isoformat() if req.end_date else None,
            "price": req.price,
            "created_at": req.created_at.isoformat() if req.created_at else None
        } for req in requests]
    })

@request_bp.get("/requests/<int:request_id>")
def get_single_request(request_id):
    req = get_request(request_id)
    if req:
        return jsonify({
            "success": True,
            "data": {
                "id": req.id,
                "type": req.type,
                "description": req.description,
                "status": req.status,
                "user_id": req.user_id,
                "car_id": req.car_id,
                "start_date": req.start_date.isoformat() if req.start_date else None,
                "end_date": req.end_date.isoformat() if req.end_date else None,
                "price": req.price,
                "created_at": req.created_at.isoformat() if req.created_at else None
            }
        })
    return jsonify({
        "success": False,
        "message": "Requête non trouvée"
    }), 404

@request_bp.post("/requests")
def add_request():
    data = request.get_json()
    required_fields = ["type", "user_id", "car_id", "start_date"]
    if not data or not all(k in data for k in required_fields):
        return jsonify({
            "success": False,
            "message": f"Les champs suivants sont requis : {', '.join(required_fields)}"
        }), 400
    
    try:
        start_date = datetime.fromisoformat(data["start_date"])

        request_data = {
            "type": data["type"],
            "status": "new",  # Toujours 'new' à la création
            "user_id": data["user_id"],
            "car_id": data["car_id"],
            "start_date": start_date
        }

        # Gestion des champs optionnels
        optional_fields = {
            "description": str,
            "end_date": lambda x: datetime.fromisoformat(x),
            "price": float
        }

        for field, converter in optional_fields.items():
            if field in data and data[field]:
                try:
                    request_data[field] = converter(data[field])
                except (ValueError, TypeError):
                    return jsonify({
                        "success": False,
                        "message": f"Format invalide pour le champ {field}"
                    }), 400
        
        try:
            req = create_request(**request_data)
            return jsonify({
                "success": True,
                "data": {
                    "id": req.id,
                    "type": req.type,
                    "status": req.status,
                    "description": req.description,
                    "user_id": req.user_id,
                    "car_id": req.car_id,
                    "start_date": req.start_date.isoformat() if req.start_date else None,
                    "end_date": req.end_date.isoformat() if req.end_date else None,
                    "price": req.price,
                    "created_at": req.created_at.isoformat() if req.created_at else None
                }
            }), 201
        except:
            return jsonify({
                "success": False,
                "message": "Une erreur s'est produite. Vérifiez si les utilisateurs ou le véhicule associé est correct."
            }), 500

    except ValueError:
        return jsonify({
            "success": False,
            "message": "Format de date invalide. Utilisez le format ISO (YYYY-MM-DDTHH:MM:SS)"
        }), 400

@request_bp.put("/requests/<int:request_id>")
def modify_request(request_id):
    data = request.get_json()
    print(data)
    if not data:
        return jsonify({
            "success": False,
            "message": "Données invalides"
        }), 400
    
    try:
        request_data = {}

        # Seuls ces champs sont modifiables
        optional_fields = {
            "description": str,
            "status": str,
            "start_date": lambda x: datetime.fromisoformat(x),
            "end_date": lambda x: datetime.fromisoformat(x),
            "price": float
        }

        for field, converter in optional_fields.items():
            if field in data and (data[field] is not None and data[field] != ''):
                try:
                    request_data[field] = converter(data[field])
                except (ValueError, TypeError):
                    return jsonify({
                        "success": False,
                        "message": f"Format invalide pour le champ {field}"
                    }), 400

        try:
            req = update_request(request_id, **request_data)
            
            if req:
                return jsonify({
                    "success": True,
                    "data": {
                        "id": req.id,
                        "type": req.type,
                        "description": req.description,
                        "status": req.status,
                        "user_id": req.user_id,
                        "car_id": req.car_id,
                        "start_date": req.start_date.isoformat() if req.start_date else None,
                        "end_date": req.end_date.isoformat() if req.end_date else None,
                        "price": req.price,
                        "created_at": req.created_at.isoformat() if req.created_at else None
                    }
                })
            
            return jsonify({
                "success": False,
                "message": "Requête non trouvée"
            }), 404

        except:
            return jsonify({
                "success": False,
                "message": "Une erreur s'est produite. Vérifiez si les données sont correctes."
            }), 500

    except ValueError:
        return jsonify({
            "success": False,
            "message": "Format de date invalide. Utilisez le format ISO (YYYY-MM-DDTHH:MM:SS)"
        }), 400

@request_bp.delete("/requests/<int:request_id>")
def remove_request(request_id):
    if delete_request(request_id):
        return jsonify({
            "success": True,
            "message": "Requête supprimée"
        })
    return jsonify({
        "success": False,
        "message": "Requête non trouvée"
    }), 404
