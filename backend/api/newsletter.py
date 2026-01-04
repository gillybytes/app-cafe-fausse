from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from .. import db as dbmod
from ..models.customer import Customer
import re

newsletter_bp = Blueprint('newsletter', __name__)

EMAIL_REGEX = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


@newsletter_bp.post('/newsletter')
def subscribe_newsletter():
    data = request.get_json(silent=True) or {}
    email = (data.get('email') or '').strip().lower()
    name = (data.get('name') or '').strip()

    if not email or not EMAIL_REGEX.match(email):
        return jsonify({"error": "Invalid email."}), 400

    db = dbmod.SessionLocal()
    try:
        customer = db.query(Customer).filter(Customer.email == email).one_or_none()
        if customer:
            customer.newsletter_signup = True
            if name and not customer.name:
                customer.name = name
        else:
            customer = Customer(name=name or email.split('@')[0], email=email, newsletter_signup=True)
            db.add(customer)
        db.commit()
        return jsonify({"message": "Subscribed successfully."}), 200
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Subscription failed due to a database error."}), 500
    finally:
        db.close()
