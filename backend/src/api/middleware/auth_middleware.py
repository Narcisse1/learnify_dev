# ⚠️ PARTIAL: Basic structure, needs completion
from functools import wraps
from flask import request, jsonify
from config import Config


def require_api_key(f):
    """
    Decorator to require API key authentication

    Checks for 'Authorization' header with format: 'Bearer YOUR_API_KEY'
    Returns 401 if missing or invalid
    """
    @wraps(f)
    def decorated_function(*args, **kwargs):
        # Extract the Authorization header
        auth_header = request.headers.get('Authorization')
        
        # Check if header exists
        if not auth_header:
            return jsonify({
                'error': {
                    'code': 'MISSING_API_KEY',
                    'message': 'Authorization header is required'
                }
            }), 401
        
        # Check if header starts with 'Bearer '
        if not auth_header.startswith('Bearer '):
            return jsonify({
                'error': {
                    'code': 'INVALID_AUTH_FORMAT',
                    'message': 'Authorization header must be in format: Bearer YOUR_API_KEY'
                }
            }), 401
        
        # Extract the API key (token after 'Bearer ')
        api_key = auth_header[7:]  # Remove 'Bearer ' prefix
        
        # Validate against Config.VALID_API_KEYS
        if api_key not in Config.VALID_API_KEYS:
            return jsonify({
                'error': {
                    'code': 'INVALID_API_KEY',
                    'message': 'Invalid API key provided'
                }
            }), 401
        
        # API key is valid, proceed with the request
        return f(*args, **kwargs)

    return decorated_function