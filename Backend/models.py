from flask_pymongo import PyMongo
from datetime import datetime
from bson import ObjectId
import enum

mongo = PyMongo()

class SeverityEnum(enum.Enum):
    LOW = 'Low'
    MEDIUM = 'Medium'
    HIGH = 'High'

class StatusEnum(enum.Enum):
    ACTIVE = 'Active'
    INACTIVE = 'Inactive'
    MAINTENANCE = 'Maintenance'
    TREATED = 'Treated'
    RESOLVED = 'Resolved'

class Field:
    @staticmethod
    def get_collection():
        return mongo.db.fields
    
    @staticmethod
    def create_indexes():
        Field.get_collection().create_index('createdAt')
    
    @staticmethod
    def to_dict(field):
        if not field:
            return None
        field['_id'] = str(field['_id'])
        return field

class Pest:
    @staticmethod
    def get_collection():
        return mongo.db.pests
    
    @staticmethod
    def create_indexes():
        Pest.get_collection().create_index('fieldId')
        Pest.get_collection().create_index('detectedDate')
    
    @staticmethod
    def to_dict(pest):
        if not pest:
            return None
        pest['_id'] = str(pest['_id'])
        if 'fieldId' in pest and isinstance(pest['fieldId'], ObjectId):
            pest['fieldId'] = str(pest['fieldId'])
        return pest

class Pump:
    @staticmethod
    def get_collection():
        return mongo.db.pumps
    
    @staticmethod
    def create_indexes():
        Pump.get_collection().create_index('fieldId')
    
    @staticmethod
    def to_dict(pump):
        if not pump:
            return None
        pump['_id'] = str(pump['_id'])
        if 'fieldId' in pump and isinstance(pump['fieldId'], ObjectId):
            pump['fieldId'] = str(pump['fieldId'])
        return pump