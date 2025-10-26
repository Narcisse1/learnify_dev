from flask import Flask, send_from_directory
from flask_cors import CORS
import os
from .routes.course_routes import course_bp
from .routes.lesson_routes import lesson_bp


def create_app():
    """Application factory pattern"""
    app = Flask(__name__)

    # Enable CORS for all routes
    CORS(app)

    # Welcome sticker for the front door – no more 404!
    @app.route('/', methods=['GET'])
    def home():
        return "Welcome to Learnify Cave! 🏰 Try /api/courses for course treasures or /docs for the map!"

    # Serve OpenAPI spec
    @app.route('/openapi.json')
    def serve_openapi():
        static_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), 'static')
        return send_from_directory(static_dir, 'openapi.json')

    # Serve docs page
    @app.route('/docs')
    def docs():
        return '''
        <!DOCTYPE html>
        <html>
        <head>
            <title>Learnify API Docs</title>
            <link rel="stylesheet" type="text/css" href="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui.css" />
        </head>
        <body>
            <div id="swagger-ui"></div>
            <script src="https://unpkg.com/swagger-ui-dist@3.25.0/swagger-ui-bundle.js"></script>
            <script>
                const ui = SwaggerUIBundle({
                    url: '/openapi.json',
                    dom_id: '#swagger-ui',
                    presets: [
                        SwaggerUIBundle.presets.apis,
                        SwaggerUIBundle.SwaggerUIStandalonePreset
                    ],
                    layout: "BaseLayout"
                });
            </script>
        </body>
        </html>
        '''

    # Register blueprints
    app.register_blueprint(course_bp, url_prefix='/api')
    app.register_blueprint(lesson_bp, url_prefix='/api')

    return app
