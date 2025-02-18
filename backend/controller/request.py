from typing import Optional, List
from models import db
from models.request import Request

def create_request(title: str, description: str, user_id: int, car_id: int) -> Request:
    request = Request(
        title=title,
        description=description,
        user_id=user_id,
        car_id=car_id,
        status="pending"
    )
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
    title: Optional[str] = None,
    description: Optional[str] = None,
    status: Optional[str] = None
) -> Optional[Request]:
    request = get_request(request_id)
    if request:
        if title is not None:
            request.title = title
        if description is not None:
            request.description = description
        if status is not None:
            request.status = status
        db.session.commit()
    return request

def delete_request(request_id: int) -> bool:
    request = get_request(request_id)
    if request:
        db.session.delete(request)
        db.session.commit()
        return True
    return False
