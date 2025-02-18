from flask import Flask, request, jsonify, make_response, Blueprint
from controller.service import create_service, get_service, get_all_services, update_service, delete_service

service_bp = Blueprint('services', __name__)

@service_bp.get("/services")
def list_services():
    services = get_all_services()
    return jsonify({
        "success": True,
        "data": [{
            "id": service.id,
            "name": service.name,
            "description": service.description
        } for service in services]
    })

@service_bp.get("/services/<int:service_id>")
def get_single_service(service_id):
    service = get_service(service_id)
    if service:
        return jsonify({
            "success": True,
            "data": {
                "id": service.id,
                "name": service.name,
                "description": service.description
            }
        })
    return jsonify({
        "success": False,
        "message": "Service non trouvé"
    }), 404

@service_bp.post("/services")
def add_service():
    data = request.get_json()
    if not data or "name" not in data or "description" not in data:
        return jsonify({
            "success": False,
            "message": "Les champs 'name' et 'description' sont requis"
        }), 400
    
    service = create_service(data["name"], data["description"])
    return jsonify({
        "success": True,
        "data": {
            "id": service.id,
            "name": service.name,
            "description": service.description
        }
    }), 201

@service_bp.put("/services/<int:service_id>")
def modify_service(service_id):
    data = request.get_json()
    if not data:
        return jsonify({
            "success": False,
            "message": "Données invalides"
        }), 400
    
    service = update_service(
        service_id,
        name=data.get("name"),
        description=data.get("description")
    )
    
    if service:
        return jsonify({
            "success": True,
            "data": {
                "id": service.id,
                "name": service.name,
                "description": service.description
            }
        })
    return jsonify({
        "success": False,
        "message": "Service non trouvé"
    }), 404

@service_bp.delete("/services/<int:service_id>")
def remove_service(service_id):
    if delete_service(service_id):
        return jsonify({
            "success": True,
            "message": "Service supprimé"
        })
    return jsonify({
        "success": False,
        "message": "Service non trouvé"
    }), 404
