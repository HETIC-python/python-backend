from functools import wraps
from flask import session

def admin_checking(f):
    @wraps(f)
    def admin_check(*args, **kwargs):
        if 'user' not in session or not session.get('is_admin', False):
            return "not_admin"
        return "is_admin"
    return admin_check