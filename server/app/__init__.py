from flask import Flask
from flask_cors import CORS
from .utils import *
from .routes.user import user_bp
from .routes.projects import projects_bp
from .routes.messages import messages_bp


def create_app():
    app = Flask(__name__)
    CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})

    app.register_blueprint(user_bp, url_prefix="/users")
    app.register_blueprint(projects_bp, url_prefix="/projects")
    app.register_blueprint(messages_bp, url_prefix="/messages")

    return app

if __name__ == "__main__": 
    app = create_app()
    app.run(debug=True)
