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

request_bp = Blueprint('requests', __name__)

@request_bp.get("/requests")
def list_requests():
    user_id = request.args.get('user_id', type=int)
    car_id = request.args.get('car_id', type=int)
    
    if user_id:
        requests = get_user_requests(user_id)
    elif car_id:
        requests = get_car_requests(car_id)
    else:
        requests = get_all_requests()
        
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
    required_fields = ["type", "status", "user_id", "car_id", "start_date"]
    if not data or not all(k in data for k in required_fields):
        return jsonify({
            "success": False,
            "message": f"Les champs suivants sont requis : {', '.join(required_fields)}"
        }), 400
    
    try:
        start_date = datetime.fromisoformat(data["start_date"])
        print(start_date)

        if "end_date" in data:
            try:
                data["end_date"] = datetime.fromisoformat(data["end_date"])
            except ValueError:
                return jsonify({
                    "success": False,
                    "message": "Format de end_date invalide. Utilisez le format ISO (YYYY-MM-DDTHH:MM:SS)"
                }), 400
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Format de start_date invalide. Utilisez le format ISO (YYYY-MM-DDTHH:MM:SS)"
        }), 400

    request_data = {
        "type": data["type"],
        "status": data["status"],
        "user_id": data["user_id"],
        "car_id": data["car_id"],
        "start_date": start_date
    }

    if "description" in data:
        request_data["description"] = data["description"]
    if "end_date" in data:
        request_data["end_date"] = data["end_date"]
    if "price" in data:
        try:
            request_data["price"] = float(data["price"])
        except (ValueError, TypeError):
            return jsonify({
                "success": False,
                "message": "Le prix doit être un nombre valide"
            }), 400

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

@request_bp.put("/requests/<int:request_id>")
def modify_request(request_id):
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Données invalides"
        }), 400
    
    try:
        start_date = datetime.fromisoformat(data["start_date"]) if "start_date" in data else None
        end_date = datetime.fromisoformat(data["end_date"]) if "end_date" in data else None
    except ValueError:
        return jsonify({
            "success": False,
            "message": "Format de date invalide. Utilisez le format ISO (YYYY-MM-DDTHH:MM:SS)"
        }), 400

    req = update_request(
        request_id,
        type=data.get("type"),
        description=data.get("description"),
        status=data.get("status"),
        start_date=start_date,
        end_date=end_date,
        price=float(data["price"]) if "price" in data else None
    )
    
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
