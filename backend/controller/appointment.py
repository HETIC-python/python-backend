from typing import Optional, List
from models.appointment import Appointment, db
from datetime import date

def create_appointment(user_id: int, service_id: int, date: date) -> Appointment:
    appointment = Appointment(user_id=user_id, service_id=service_id, date=date)
    db.session.add(appointment)
    db.session.commit()
    return appointment

def get_appointment(appointment_id: int) -> Optional[Appointment]:
    return Appointment.query.get(appointment_id)

def get_appointments_by_user_id(user_id: int) -> List[Appointment]:
    return Appointment.query.filter_by(user_id=user_id).all()

def get_all_appointments() -> List[Appointment]:
    return Appointment.query.all()

def update_appointment(appointment_id: int, date: Optional[date]= None) -> Optional[Appointment]:
    appointment = get_appointment(appointment_id)
    if appointment and date is not None :
        appointment.date = date
        db.session.commit()
    return appointment

def delete_appointment(appointment_id: int) -> bool:
    appointment = get_appointment(appointment_id)
    if appointment:
        db.session.delete(appointment)
        db.session.commit()
        return True
    return False