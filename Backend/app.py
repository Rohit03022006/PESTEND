from flask import Flask, jsonify
from flask_cors import CORS
from flask_pymongo import PyMongo
from models import mongo, Field, Pest, Pump
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

def create_app():
    app = Flask(__name__)
    
    app.config['MONGO_URI'] = os.getenv('MONGODB_URI')
    app.config['JSON_SORT_KEYS'] = False
    
    mongo.init_app(app)
    
    CORS(app, origins=os.getenv('CLIENT_URL', 'http://localhost:5173'), supports_credentials=True)
    
    api_prefix = os.getenv('API_PREFIX', '/api')
    from routes.api_routes import api_bp
    app.register_blueprint(api_bp, url_prefix=api_prefix)
    
    @app.route('/api/health')
    def health_check():
        return jsonify({
            'success': True,
            'message': 'Server is running',
            'timestamp': datetime.utcnow().isoformat()
        })
    
    @app.route('/api/test')
    def test_route():
        """Test route to verify server is working"""
        try:
            mongo.db.command('ping')
            db_status = 'connected'
        except Exception as e:
            db_status = f'error: {str(e)}'
        
        return jsonify({
            'success': True,
            'message': 'Test route is working!',
            'server_time': datetime.utcnow().isoformat(),
            'database_status': db_status,
            'environment': os.getenv('NODE_ENV', 'development'),
            'api_prefix': os.getenv('API_PREFIX', '/api'),
            'endpoints': {
                'health': 'api/health',
                'test': 'api/test',
                'api_base': f'{os.getenv("API_PREFIX", "/api")}/'
            }
        })
    
    @app.errorhandler(404)
    def not_found(error):
        return jsonify({
            'success': False,
            'message': 'Route not found'
        }), 404
    
    @app.errorhandler(Exception)
    def handle_error(error):
        print(f'Unhandled error: {error}')
        return jsonify({
            'success': False,
            'message': 'Internal server error',
            'error': str(error) if os.getenv('NODE_ENV') == 'development' else 'Something went wrong'
        }), 500
    
    return app

if __name__ == '__main__':
    app = create_app()
    
    with app.app_context():
        try:
            Field.create_indexes()
            Pest.create_indexes()
            Pump.create_indexes()
            print("Database indexes created successfully")
        except Exception as e:
            print(f"Error creating indexes: {e}")
    
    port = int(os.getenv('PORT', 5000))
    env = os.getenv('NODE_ENV', 'development')
    api_prefix = os.getenv('API_PREFIX', '/api')
    
    print(f'Server running on port {port}')
    print(f'Environment: {env}')
    print(f'API available at: http://localhost:{port}{api_prefix}')
    print(f'MongoDB connected to: {app.config["MONGO_URI"]}')
    print(f'Test route available at: http://localhost:{port}/test')
    
    app.run(host='0.0.0.0', port=port, debug=(env == 'development'))
