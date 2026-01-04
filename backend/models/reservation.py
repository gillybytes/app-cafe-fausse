from sqlalchemy import Column, Integer, ForeignKey, DateTime, UniqueConstraint
from sqlalchemy.orm import relationship
from ..db import Base


class Reservation(Base):
    __tablename__ = 'reservations'
    __table_args__ = (
        UniqueConstraint('time_slot', 'table_number', name='uq_time_table'),
    )

    id = Column(Integer, primary_key=True)
    customer_id = Column(Integer, ForeignKey('customers.id'), nullable=False, index=True)
    time_slot = Column(DateTime(timezone=True), nullable=False, index=True)
    table_number = Column(Integer, nullable=False)
    guests = Column(Integer, nullable=False, default=1)

    customer = relationship('Customer')
