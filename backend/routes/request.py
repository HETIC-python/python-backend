from flask import Blueprint, request, jsonify
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
            "title": req.title,
            "description": req.description,
            "status": req.status,
            "user_id": req.user_id,
            "car_id": req.car_id,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
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
                "title": req.title,
                "description": req.description,
                "status": req.status,
                "user_id": req.user_id,
                "car_id": req.car_id,
                "created_at": req.created_at.isoformat() if req.created_at else None,
                "updated_at": req.updated_at.isoformat() if req.updated_at else None
            }
        })
    return jsonify({
        "success": False,
        "message": "Requête non trouvée"
    }), 404

@request_bp.post("/requests")
def add_request():
    data = request.get_json()
    if not data or not all(k in data for k in ["title", "description", "user_id", "car_id"]):
        return jsonify({
            "success": False,
            "message": "Les champs 'title', 'description', 'user_id' et 'car_id' sont requis"
        }), 400
    
    req = create_request(
        title=data["title"],
        description=data["description"],
        user_id=data["user_id"],
        car_id=data["car_id"]
    )
    
    return jsonify({
        "success": True,
        "data": {
            "id": req.id,
            "title": req.title,
            "description": req.description,
            "status": req.status,
            "user_id": req.user_id,
            "car_id": req.car_id,
            "created_at": req.created_at.isoformat() if req.created_at else None,
            "updated_at": req.updated_at.isoformat() if req.updated_at else None
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
    
    req = update_request(
        request_id,
        title=data.get("title"),
        description=data.get("description"),
        status=data.get("status")
    )
    
    if req:
        return jsonify({
            "success": True,
            "data": {
                "id": req.id,
                "title": req.title,
                "description": req.description,
                "status": req.status,
                "user_id": req.user_id,
                "car_id": req.car_id,
                "created_at": req.created_at.isoformat() if req.created_at else None,
                "updated_at": req.updated_at.isoformat() if req.updated_at else None
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
