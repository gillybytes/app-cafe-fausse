import os
import random
from flask import Blueprint, request, jsonify
from sqlalchemy.exc import IntegrityError
from sqlalchemy import and_
from dateutil import parser as dateparser
from datetime import datetime, time

from ..db import SessionLocal
from ..models.customer import Customer
from ..models.reservation import Reservation

reservations_bp = Blueprint('reservations', __name__)

TOTAL_TABLES = 30


def within_service_hours(dt: datetime) -> bool:
    # All times assumed in restaurant local time (no tz conversion here)
    # Mon-Sat: 17:00-23:00, Sun: 17:00-21:00
    weekday = dt.weekday()  # Mon=0 .. Sun=6
    start = time(17, 0)
    end = time(23, 0) if weekday in range(0, 6) else time(21, 0)
    t = dt.time()
    return (t >= start) and (t <= end)


@reservations_bp.post('/reservations')
def create_reservation():
    data = request.get_json(silent=True) or {}
    time_slot_str = data.get('timeSlot')
    guests = int(data.get('guests') or 1)
    name = (data.get('name') or '').strip()
    email = (data.get('email') or '').strip().lower()
    phone = (data.get('phone') or '').strip() or None

    if not time_slot_str or not name or not email or guests <= 0:
        return jsonify({"error": "Missing required fields."}), 400

    try:
        dt = dateparser.isoparse(time_slot_str)
        # Normalize seconds/microseconds for discrete sloting if needed
        dt = dt.replace(second=0, microsecond=0)
    except Exception:
        return jsonify({"error": "Invalid time slot format."}), 400

    now = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    if dt < now:
        return jsonify({"error": "Time slot must be in the future."}), 400

    if not within_service_hours(dt):
        return jsonify({"error": "Selected time is outside service hours."}), 400

    db = SessionLocal()
    try:
        # Upsert/find customer by email
        customer = db.query(Customer).filter(Customer.email == email).one_or_none()
        if customer:
            customer.name = customer.name or name
            if phone and not customer.phone:
                customer.phone = phone
        else:
            customer = Customer(name=name, email=email, phone=phone)
            db.add(customer)
            db.flush()

        # Find taken tables for this exact time slot
        existing = db.query(Reservation).filter(Reservation.time_slot == dt).all()
        taken_tables = {r.table_number for r in existing}

        if len(taken_tables) >= TOTAL_TABLES:
            db.rollback()
            return jsonify({"error": "This time slot is fully booked."}), 409

        # Find a free table randomly
        free_tables = [t for t in range(1, TOTAL_TABLES + 1) if t not in taken_tables]
        table_number = random.choice(free_tables)

        reservation = Reservation(
            customer_id=customer.id,
            time_slot=dt,
            table_number=table_number,
            guests=guests,
        )
        db.add(reservation)
        db.commit()

        return jsonify({
            "message": "Reservation confirmed.",
            "tableNumber": table_number,
            "timeSlot": dt.isoformat(),
        }), 201
    except IntegrityError:
        db.rollback()
        return jsonify({"error": "Reservation conflict. Please try another time."}), 409
    except Exception:
        db.rollback()
        return jsonify({"error": "Unexpected server error."}), 500
    finally:
        db.close()
