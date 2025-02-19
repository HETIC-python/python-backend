from typing import Optional, List
from datetime import datetime
from models import db
from models.request import Request

def create_request(
    type: str,
    status: str,
    user_id: int,
    car_id: int,
    start_date: datetime,
    **kwargs
) -> Request:
    request_data = {
        "type": type,
        "status": status,
        "user_id": user_id,
        "car_id": car_id,
        "start_date": start_date,
        **kwargs
    }
    request = Request(**request_data)
    db.session.add(request)
    db.session.commit()
    return request

def get_request(request_id: int) -> Optional[Request]:
    return Request.query.get(request_id)

def get_all_requests() -> List[Request]:
    return Request.query.all()

def get_user_requests(user_id: int) -> List[Request]:
    return Request.query.filter_by(user_id=user_id).all()

def get_car_requests(car_id: int) -> List[Request]:
    return Request.query.filter_by(car_id=car_id).all()

def update_request(
    request_id: int,
    type: Optional[str] = None,
    description: Optional[str] = None,
    status: Optional[str] = None,
    start_date: Optional[datetime] = None,
    end_date: Optional[datetime] = None,
    price: Optional[float] = None
) -> Optional[Request]:
    request = get_request(request_id)
    if request:
        if type is not None:
            request.type = type
        if description is not None:
            request.description = description
        if status is not None:
            request.status = status
        if start_date is not None:
            request.start_date = start_date
        if end_date is not None:
            request.end_date = end_date
        if price is not None:
            request.price = price
        db.session.commit()
    return request

def delete_request(request_id: int) -> bool:
    request = get_request(request_id)
    if request:
        db.session.delete(request)
        db.session.commit()
        return True
    return False
