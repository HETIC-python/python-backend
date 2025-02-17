from typing import Optional, List
from models import db
from models.service import Service

def create_service(name: str, description: str) -> Service:
    service = Service(name=name, description=description)
    db.session.add(service)
    db.session.commit()
    return service

def get_service(service_id: int) -> Optional[Service]:
    return Service.query.get(service_id)

def get_all_services() -> List[Service]:
    return Service.query.all()

def update_service(service_id: int, name: Optional[str] = None, description: Optional[str] = None) -> Optional[Service]:
    service = get_service(service_id)
    if service:
        if name is not None:
            service.name = name
        if description is not None:
            service.description = description
        db.session.commit()
    return service

def delete_service(service_id: int) -> bool:
    service = get_service(service_id)
    if service:
        db.session.delete(service)
        db.session.commit()
        return True
    return False
