const mongoose = require('mongoose');

// Field Schema
const fieldSchema = new mongoose.Schema({
  cropType: {
    type: String,
    required: [true, 'Crop type is required'],
    trim: true
  },
  area: {
    type: String,
    required: [true, 'Area is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  latitude: {
    type: String,
    trim: true
  },
  longitude: {
    type: String,
    trim: true
  },
  expectedHarvest: {
    type: Date,
    required: [true, 'Expected harvest date is required']
  },
  pesticidePumps: {
    type: Number,
    required: [true, 'Number of pesticide pumps is required'],
    min: [0, 'Pesticide pumps cannot be negative']
  },
  plantingDate: {
    type: Date,
    required: [true, 'Planting date is required']
  },
  soilType: {
    type: String,
    trim: true,
    default: 'Not specified'
  },
  irrigationType: {
    type: String,
    trim: true,
    default: 'Not specified'
  }
}, {
  timestamps: true
});

// Pest Detection Schema
const pestSchema = new mongoose.Schema({
  fieldId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Field',
    required: true
  },
  pestName: {
    type: String,
    required: [true, 'Pest name is required'],
    trim: true
  },
  severity: { 
    type: String, 
    enum: ['Low', 'Medium', 'High'],
    required: [true, 'Severity is required']
  },
  affectedArea: {
    type: String,
    required: [true, 'Affected area is required'],
    trim: true
  },
  detectedDate: { 
    type: Date, 
    default: Date.now 
  },
  description: {
    type: String,
    trim: true
  },
  imageUrl: {
    type: String,
    trim: true
  },
  recommendedTreatment: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['Active', 'Treated', 'Resolved'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Pump Schema
const pumpSchema = new mongoose.Schema({
  fieldId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Field',
    required: true
  },
  pumpName: {
    type: String,
    required: [true, 'Pump name is required'],
    trim: true
  },
  status: { 
    type: String, 
    enum: ['Active', 'Inactive', 'Maintenance'],
    default: 'Active'
  },
  capacity: {
    type: String,
    required: [true, 'Capacity is required'],
    trim: true
  },
  lastMaintenance: {
    type: Date,
    required: [true, 'Last maintenance date is required']
  },
  location: {
    type: String,
    trim: true
  },
  nextMaintenance: {
    type: Date
  },
  operationalHours: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Create models
const Field = mongoose.model('Field', fieldSchema);
const Pest = mongoose.model('Pest', pestSchema);
const Pump = mongoose.model('Pump', pumpSchema);

module.exports = {
  Field,
  Pest,
  Pump
};