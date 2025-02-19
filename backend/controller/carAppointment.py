from typing import Optional, List
from models.carAppointment import CarAppointment, db
from datetime import datetime

def create_car_appointment(user_id: int, car_id: int, date: datetime) -> CarAppointment:
    carAppointment = CarAppointment(user_id=user_id, car_id=car_id, date=date)
    db.session.add(carAppointment)
    db.session.commit()
    return carAppointment

def get_car_appointment(appointment_id: int) -> Optional[CarAppointment]:
    return CarAppointment.query.get(appointment_id)

def get_car_appointments_by_user_id(user_id: int) -> List[CarAppointment]:
    return CarAppointment.query.filter_by(user_id=user_id).all()

def get_all_car_appointments() -> List[CarAppointment]:
    return CarAppointment.query.all()

def update_car_appointment(appointment_id: int, date: Optional[datetime]= None) -> Optional[CarAppointment]:
    carAppointment = get_car_appointment(appointment_id)
    if carAppointment and date is not None :
        carAppointment.date = date
        db.session.commit()
    return carAppointment

def delete_car_appointment(appointment_id: int) -> bool:
    carAppointment = get_car_appointment(appointment_id)
    if carAppointment:
        db.session.delete(carAppointment)
        db.session.commit()
        return True
    return False