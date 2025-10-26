# learnify_app/backend/wsgi.py

import sys
import os

# Add the 'src' directory to the Python path so 'src.app' can be found
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

# Now the import should work
from app import create_app 

# create_app is the application factory function
app = create_app()

if __name__ == "__main__":
    app.run()
