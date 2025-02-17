from flask import Flask, request, jsonify, make_response, Blueprint
from controller.appointment import create_appointment, get_appointment, get_appointments_by_user_id, get_all_appointments, update_appointment, delete_appointment

appointment_bp = Blueprint('appointments', __name__)

@appointment_bp.get("/appointments")
def list_appointments():
    appointments = get_all_appointments()
    return jsonify([{
        "id": appointment.id,
        "user_id": appointment.user_id,
        "service_id": appointment.service_id,
        "date": appointment.date
    } for appointment in appointments])

@appointment_bp.get("/appointments/user/<int:user_id>")
def get_user_appointments(user_id):
    appointments = get_appointments_by_user_id(user_id)
    return jsonify([{
        "id": appointment.id,
        "user_id": appointment.user_id,
        "service_id": appointment.service_id,
        "date": appointment.date
        "created_at": appointment.created_at
    } for appointment in appointments])

@appointment_bp.get("/appointments/<int:appointment_id>")
def get_single_appointment(appointment_id)
    appointment = get_appointment(appointment_id)
    if appointment:
        return jsonify({
            "id": appointment.id,
            "user_id": appointment.user_id,
            "service_id": appointment.service_id,
            "date": appointment.date,
            "created_at": appointment.created_at
        })
    return jsonify({"message": f"No appointment found with id : {appointment_id}"})

@appointment_bp.post("/appointments")
def add_appointment():
    data = request.get_json()
    if not data or "user_id" not in data or "service_id" not in data or date not in data:
        return jsonify({"message": "Champs manquant"}), 400

    appointment = create_appointment(data["user_id"], data[service_id], data["date"])
    return jsonify({
        "id": appointment.id,
        "user_id": appointment.user_id,
        "service_id": appointment.service_id,
        "date": appointment.date
        "created_at": appointment.created_at
    }), 201

@appointment_bp.put("appointments/<int:appointment_id>")
def modify_appointment(appointment_id)
    data = request.get_json()
    if not data or "date" not in data:
        return jsonify({"message": "Invalid data"}), 400

    appointment = update_appointment(appointment_id, data["date"])
    if appointment:
        return jsonify({
            "id": appointment.id,
            "user_id": appointment.user_id,
            "service_id": appointment.service_id,
            "date": appointment.date
            "created_at": appointment.created_at
        })
    return jsonify({"message": f"Couldn't resolve appointment with id : {appointment_id}"}), 404

@appointment_bp.delete("/appointments/<int:appointment_id>")
def remove_appointment(appointment_id)
    if delete_appointment(appointment_id):
        return jsonify({"message": f"Appointment with id : {appointment_id} deleted"})
    return jsonify({"message": f"Couldn't resolve appointment with id : {appointment_id}"}, 404)