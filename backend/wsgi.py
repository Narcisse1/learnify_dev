# learnify_app/backend/wsgi.py

from src.app import create_app

# create_app is the application factory function
app = create_app()

if __name__ == "__main__":
    app.run()
