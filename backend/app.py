import os
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

from .api.reservations import reservations_bp
from .api.newsletter import newsletter_bp
from . import db as dbmod
from .db import init_db, Base, configure_engine
from . import models  # noqa: F401 ensure models are registered


def create_app():
    load_dotenv()
    app = Flask(__name__)

    # CORS
    cors_origins = os.getenv("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": cors_origins}})

    # Blueprints
    app.register_blueprint(reservations_bp, url_prefix="/api")
    app.register_blueprint(newsletter_bp, url_prefix="/api")

    # Initialize DB and create tables if not exist
    init_db()
    configure_engine()
    Base.metadata.create_all(bind=dbmod.engine)

    @app.teardown_appcontext
    def remove_session(exception=None):
        if dbmod.SessionLocal is not None:
            dbmod.SessionLocal.remove()

    @app.route("/api/health")
    def health():
        return jsonify({"status": "ok"})

    return app


app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
