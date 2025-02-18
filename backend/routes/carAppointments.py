from flask import Flask, request, jsonify, make_response, Blueprint
from controller.carAppointment import get_car_appointment, get_car_appointments_by_user_id, get_all_car_appointments, update_car_appointment, delete_car_appointment

car_appointment_bp = Blueprint('carAppointment', __name__)

@car_appointment_bp.get("/carAppointments")
def list_car_appointments():
    carAppointments = get_all_car_appointments()
    return jsonify([{
        "id": carAppointment.id,
        "user_id": appointment.user_id,
        "car_id": appointment.car_id,
        "date": appointment.date
    } for appointment in carAppointments])

@car_appointment_bp.get("/carAppointments/user/<int:user_id>")
def get_user_car_appointments(user_id):
    carAppointments = get_car_appointments_by_user_id(user_id)
    return jsonify([{
        "id": appointment.id,
        "user_id": appointment.user_id,
        "car_id": appointment.car_id,
        "date": appointment.date,
        "created_at": appointment.created_at
    } for appointment in carAppointments])

@car_appointment_bp.get("/carAppointments/<int:appointment_id>")
def get_single_appointment(appointment_id):
    carAppointment = get_car_appointment(appointment_id)
    if carAppointment:
        return jsonify({
            "id": appointment.id,
            "user_id": appointment.user_id,
            "car_id": appointment.car_id,
            "date": appointment.date,
            "created_at": appointment.created_at
        })
    return jsonify({"message": f"No car appointment found with id : {appointment_id}"})

@car_appointment_bp.post("/carAppointments")
def add_car_appointment():
    data = request.get_json()
    if not data or "user_id" not in data or "car_id" not in data or "date" not in data:
        return jsonify({"message": "Champs manquant"}), 400

    appointment = create_car_appointment(data["user_id"], data["service_id"], data["date"])
    return jsonify({
        "id": appointment.id,
        "user_id": appointment.user_id,
        "car_id": appointment.car_id,
        "date": appointment.date,
        "created_at": appointment.created_at
    }), 201

@car_appointment_bp.put("carAppointments/<int:appointment_id>")
def modify_car_appointment(appointment_id):
    data = request.get_json()
    if not data or "date" not in data:
        return jsonify({"message": "Invalid data"}), 400

    appointment = update_car_appointment(appointment_id, data["date"])
    if appointment:
        return jsonify({
            "id": appointment.id,
            "user_id": appointment.user_id,
            "car_id": appointment.car_id,
            "date": appointment.date,
            "created_at": appointment.created_at
        })
    return jsonify({"message": f"Couldn't resolve appointment with id : {appointment_id}"}), 404

@car_appointment_bp.delete("/carAppointments/<int:appointment_id>")
def remove_car_appointment(appointment_id):
    if delete_car_appointment(appointment_id):
        return jsonify({"message": f"Car appointment with id : {appointment_id} deleted"})
    return jsonify({"message": f"Couldn't resolve car appointment with id : {appointment_id}"}, 404) 