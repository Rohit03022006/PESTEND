from flask import Blueprint, request, jsonify
from models import mongo, Field, Pest, Pump, SeverityEnum, StatusEnum
from bson import ObjectId
from datetime import datetime

api_bp = Blueprint('api', __name__)

@api_bp.route('/fields/latest', methods=['GET'])
def get_latest_field():
    try:
        latest_field = Field.get_collection().find_one(sort=[('createdAt', -1)])
        
        if not latest_field:
            return jsonify({
                'success': False,
                'message': 'No field data found',
                'data': None
            }), 404
        
        return jsonify({
            'success': True,
            'data': Field.to_dict(latest_field)
        }), 200
        
    except Exception as error:
        print(f'Error fetching latest field data: {error}')
        return jsonify({
            'success': False,
            'message': 'Error fetching field data',
            'error': str(error)
        }), 500

@api_bp.route('/pests', methods=['GET'])
def get_pests():
    try:
        latest_field = Field.get_collection().find_one(sort=[('createdAt', -1)])
        
        if not latest_field:
            return jsonify({
                'success': False,
                'message': 'No field data found. Please add field information first.',
                'data': []
            }), 404
        
        pests = list(Pest.get_collection().find(
            {'fieldId': latest_field['_id']}
        ).sort('detectedDate', -1))
        
        return jsonify({
            'success': True,
            'data': [Pest.to_dict(pest) for pest in pests]
        }), 200
        
    except Exception as error:
        print(f'Error fetching pest data: {error}')
        return jsonify({
            'success': False,
            'message': 'Error fetching pest data',
            'error': str(error)
        }), 500

@api_bp.route('/pumps', methods=['GET'])
def get_pumps():
    try:
        latest_field = Field.get_collection().find_one(sort=[('createdAt', -1)])
        
        if not latest_field:
            return jsonify({
                'success': False,
                'message': 'No field data found. Please add field information first.',
                'data': []
            }), 404
        
        pumps = list(Pump.get_collection().find({'fieldId': latest_field['_id']}))
        
        return jsonify({
            'success': True,
            'data': [Pump.to_dict(pump) for pump in pumps]
        }), 200
        
    except Exception as error:
        print(f'Error fetching pump data: {error}')
        return jsonify({
            'success': False,
            'message': 'Error fetching pump data',
            'error': str(error)
        }), 500

@api_bp.route('/fields', methods=['POST'])
def create_field():
    try:
        field_data = request.get_json()
        
        # Validate required fields
        required_fields = ['cropType', 'area', 'location', 'expectedHarvest', 'pesticidePumps', 'plantingDate']
        missing_fields = [field for field in required_fields if field not in field_data or not field_data[field]]
        
        if missing_fields:
            return jsonify({
                'success': False,
                'message': f'Missing required fields: {", ".join(missing_fields)}'
            }), 400
        
        # Prepare data for MongoDB
        field_doc = {
            'cropType': field_data['cropType'],
            'area': field_data['area'],
            'location': field_data['location'],
            'latitude': field_data.get('latitude'),
            'longitude': field_data.get('longitude'),
            'expectedHarvest': field_data['expectedHarvest'],
            'pesticidePumps': field_data['pesticidePumps'],
            'plantingDate': field_data['plantingDate'],
            'soilType': field_data.get('soilType', 'Not specified'),
            'irrigationType': field_data.get('irrigationType', 'Not specified'),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = Field.get_collection().insert_one(field_doc)
        field_doc['_id'] = str(result.inserted_id)
        
        return jsonify({
            'success': True,
            'message': 'Field data saved successfully',
            'data': field_doc
        }), 201
        
    except Exception as error:
        print(f'Error saving field data: {error}')
        return jsonify({
            'success': False,
            'message': 'Error saving field data',
            'error': str(error)
        }), 500

@api_bp.route('/fields', methods=['GET'])
def get_fields():
    try:
        fields = list(Field.get_collection().find().sort('createdAt', -1))
        
        return jsonify({
            'success': True,
            'data': [Field.to_dict(field) for field in fields]
        }), 200
        
    except Exception as error:
        print(f'Error fetching fields: {error}')
        return jsonify({
            'success': False,
            'message': 'Error fetching fields',
            'error': str(error)
        }), 500

@api_bp.route('/pests', methods=['POST'])
def create_pest():
    try:
        pest_data = request.get_json()
        
        latest_field = Field.get_collection().find_one(sort=[('createdAt', -1)])
        if not latest_field:
            return jsonify({
                'success': False,
                'message': 'No field data found'
            }), 404
        
        # Prepare data for MongoDB
        pest_doc = {
            'fieldId': latest_field['_id'],
            'pestName': pest_data['pestName'],
            'severity': pest_data['severity'],
            'affectedArea': pest_data['affectedArea'],
            'detectedDate': pest_data.get('detectedDate', datetime.utcnow().isoformat()),
            'description': pest_data.get('description'),
            'imageUrl': pest_data.get('imageUrl'),
            'recommendedTreatment': pest_data.get('recommendedTreatment'),
            'status': pest_data.get('status', 'Active'),
            'createdAt': datetime.utcnow(),
            'updatedAt': datetime.utcnow()
        }
        
        result = Pest.get_collection().insert_one(pest_doc)
        pest_doc['_id'] = str(result.inserted_id)
        pest_doc['fieldId'] = str(pest_doc['fieldId'])
        
        return jsonify({
            'success': True,
            'message': 'Pest data saved successfully',
            'data': pest_doc
        }), 201
        
    except Exception as error:
        print(f'Error saving pest data: {error}')
        return jsonify({
            'success': False,
            'message': 'Error saving pest data',
            'error': str(error)
        }), 500


