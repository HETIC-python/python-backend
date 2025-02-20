from functools import wraps
from flask import jsonify
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from models.user import User


def admin_checking(f):
    @wraps(f)
    def admin_check(*args, **kwargs):
        try:
            verify_jwt_in_request()
            claims = get_jwt()
            user = User.query.get(claims.get("sub"))
            if user.role != "admin":
                return (
                    jsonify({"message": "Unauthorized: Admin access required"}),
                    401,
                )  # Unauthorized
            return f(*args, **kwargs)
        except Exception as e:
            print("Admin check error:", str(e))
            return jsonify({"error": str(e)}), 401

    return admin_check

# @jwt_required()  # JWT check first
# @admin_checking  # Then admin check