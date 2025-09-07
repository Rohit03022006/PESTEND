const express = require('express');
const router = express.Router();
const { Field, Pest, Pump } = require('../models/Schemas');

// GET /api/fields/latest - Retrieve the most recent field data
router.get('/fields/latest', async (req, res) => {
  try {
    const latestField = await Field.findOne().sort({ createdAt: -1 });
    
    if (!latestField) {
      return res.status(404).json({
        success: false,
        message: 'No field data found',
        data: null
      });
    }
    
    res.status(200).json({
      success: true,
      data: latestField
    });
  } catch (error) {
    console.error('Error fetching latest field data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching field data',
      error: error.message
    });
  }
});

// GET /api/pests - Retrieve pest detection data
router.get('/pests', async (req, res) => {
  try {
    const latestField = await Field.findOne().sort({ createdAt: -1 });
    
    if (!latestField) {
      return res.status(404).json({
        success: false,
        message: 'No field data found. Please add field information first.',
        data: []
      });
    }
    
    const pests = await Pest.find({ fieldId: latestField._id }).sort({ detectedDate: -1 });
    
    if (pests.length === 0) {
      const samplePests = [
        {
          pestName: 'Bollworm',
          severity: 'High',
          affectedArea: '25%',
          detectedDate: new Date('2024-07-10'),
          description: 'Cotton bollworm infestation detected in northern section',
          recommendedTreatment: 'Apply neem-based organic pesticide',
          fieldId: latestField._id
        },
        {
          pestName: 'Aphids',
          severity: 'Medium',
          affectedArea: '15%',
          detectedDate: new Date('2024-07-12'),
          description: 'Aphid colonies found on younger leaves',
          recommendedTreatment: 'Introduce ladybugs as natural predators',
          fieldId: latestField._id
        },
        {
          pestName: 'Whitefly',
          severity: 'Low',
          affectedArea: '8%',
          detectedDate: new Date('2024-07-08'),
          description: 'Minor whitefly presence detected',
          recommendedTreatment: 'Apply yellow sticky traps and neem oil',
          fieldId: latestField._id
        }
      ];
      
      const createdPests = await Pest.insertMany(samplePests);
      return res.status(200).json({
        success: true,
        data: createdPests
      });
    }
    
    res.status(200).json({
      success: true,
      data: pests
    });
  } catch (error) {
    console.error('Error fetching pest data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pest data',
      error: error.message
    });
  }
});

// GET /api/pumps - Retrieve pump status data
router.get('/pumps', async (req, res) => {
  try {
    const latestField = await Field.findOne().sort({ createdAt: -1 });
    
    if (!latestField) {
      return res.status(404).json({
        success: false,
        message: 'No field data found. Please add field information first.',
        data: []
      });
    }
    
    const pumps = await Pump.find({ fieldId: latestField._id });
    
    if (pumps.length === 0) {
      const pumpCount = latestField.pesticidePumps || 3;
      const samplePumps = [];
      
      const pumpNames = ['North Section Pump', 'South Section Pump', 'East Section Pump', 'West Section Pump'];
      const pumpStatuses = ['Active', 'Inactive', 'Maintenance'];
      
      for (let i = 0; i < pumpCount; i++) {
        samplePumps.push({
          pumpName: pumpNames[i] || `Pump ${i + 1}`,
          status: pumpStatuses[i % pumpStatuses.length],
          capacity: `${Math.floor(Math.random() * 50) + 50}%`,
          lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
          location: `Section ${String.fromCharCode(65 + i)}`,
          nextMaintenance: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
          fieldId: latestField._id
        });
      }
      
      const createdPumps = await Pump.insertMany(samplePumps);
      return res.status(200).json({
        success: true,
        data: createdPumps
      });
    }
    
    res.status(200).json({
      success: true,
      data: pumps
    });
  } catch (error) {
    console.error('Error fetching pump data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pump data',
      error: error.message
    });
  }
});

// POST /api/fields - Save field data
router.post('/fields', async (req, res) => {
  try {
    const fieldData = req.body;
    
    // Validate required fields
    const requiredFields = ['cropType', 'area', 'location', 'expectedHarvest', 'pesticidePumps', 'plantingDate'];
    const missingFields = requiredFields.filter(field => !fieldData[field]);
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`
      });
    }
    
    const newField = new Field(fieldData);
    await newField.save();
    
    res.status(201).json({
      success: true,
      message: 'Field data saved successfully',
      data: newField
    });
  } catch (error) {
    console.error('Error saving field data:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving field data',
      error: error.message
    });
  }
});

// GET /api/fields - Get all fields
router.get('/fields', async (req, res) => {
  try {
    const fields = await Field.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: fields
    });
  } catch (error) {
    console.error('Error fetching fields:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching fields',
      error: error.message
    });
  }
});

// POST /api/pests - Create new pest detection
router.post('/pests', async (req, res) => {
  try {
    const pestData = req.body;
    
    const latestField = await Field.findOne().sort({ createdAt: -1 });
    if (!latestField) {
      return res.status(404).json({
        success: false,
        message: 'No field data found'
      });
    }
    
    pestData.fieldId = latestField._id;
    const newPest = new Pest(pestData);
    await newPest.save();
    
    res.status(201).json({
      success: true,
      message: 'Pest data saved successfully',
      data: newPest
    });
  } catch (error) {
    console.error('Error saving pest data:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving pest data',
      error: error.message
    });
  }
});

module.exports = router;