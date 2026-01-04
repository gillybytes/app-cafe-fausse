import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base, scoped_session

engine = None
SessionLocal = None
Base = declarative_base()


def configure_engine():
    global engine, SessionLocal
    if engine is not None and SessionLocal is not None:
        return
    database_url = os.getenv("DATABASE_URL")
    if not database_url:
        raise RuntimeError(
            "DATABASE_URL is not set. Create backend/.env with your local Postgres connection string."
        )
    engine = create_engine(database_url, pool_pre_ping=True, future=True)
    SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))


def init_db():
    # Hook for migrations or seed data if needed
    pass
