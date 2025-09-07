import React, { useState, useEffect } from 'react';
import { FiArrowRight, FiMap, FiDroplet, FiBarChart2, FiAlertTriangle, FiShoppingCart, FiRefreshCw } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [fieldData, setFieldData] = useState(null);
  const [pestData, setPestData] = useState([]);
  const [pumps, setPumps] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from MongoDB
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch field data
      const fieldResponse = await axios.get('http://localhost:5000/api/fields/latest');
      const fieldData = fieldResponse.data.data;
      setFieldData(fieldData);

      // Fetch pest data
      const pestResponse = await axios.get('http://localhost:5000/api/pests');
      const pestData = pestResponse.data.data || [];
      setPestData(pestData);

      // Fetch pump data
      const pumpsResponse = await axios.get('http://localhost:5000/api/pumps');
      const pumpData = pumpsResponse.data.data || [];
      setPumps(pumpData);

      // Calculate stats based on fetched data
      calculateStats(fieldData, pestData);

    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (fieldData, pestData) => {
    if (!fieldData) return;

    // Calculate health score based on pest severity
    let healthScore = 100;
    if (pestData && pestData.length > 0) {
      pestData.forEach(pest => {
        if (pest.severity === 'High') healthScore -= 15;
        else if (pest.severity === 'Medium') healthScore -= 8;
        else if (pest.severity === 'Low') healthScore -= 4;
      });
    }

    healthScore = Math.max(healthScore, 0);

    // Calculate predicted yield based on crop type and health
    let baseYield = '3.2 tons/acre';
    if (fieldData.cropType === 'Rice') baseYield = '4.1 tons/acre';
    if (fieldData.cropType === 'Wheat') baseYield = '3.8 tons/acre';

    // Adjust yield based on health score
    const yieldFactor = healthScore / 100;
    const predictedYield = `${(parseFloat(baseYield) * yieldFactor).toFixed(1)} tons/acre`;

    setStats({
      healthScore,
      predictedYield,
      treatmentEffectiveness: '85%',
      riskLevel: healthScore < 60 ? 'High' : healthScore < 80 ? 'Moderate' : 'Low'
    });
  };

  // Simulate 3D map data
  const render3DMap = () => {
    return (
      <div className="bg-gray-800 rounded-lg p-4 h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-green-700 to-green-400 opacity-50"></div>
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex justify-between items-center text-white">
            <div className="bg-red-500 rounded-full w-4 h-4"></div>
            <div className="bg-yellow-500 rounded-full w-4 h-4"></div>
            <div className="bg-orange-500 rounded-full w-4 h-4"></div>
            <div className="bg-green-500 rounded-full w-4 h-4"></div>
          </div>
          <div className="text-white text-xs mt-2 text-center">Field Health Heatmap</div>
        </div>
        <div className="absolute top-4 left-4 text-white">
          <h3 className="font-semibold">3D Field Analysis</h3>
          <p className="text-xs">Pest damage visualization</p>
        </div>
      </div>
    );
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    return status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Farm Management Dashboard</h1>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={fetchDashboardData}
              className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium flex items-center text-sm"
            >
              <FiRefreshCw className="mr-2" />
              Refresh Data
            </button>
            <Link to="/pesticide-store">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium flex items-center text-sm">
                <FiShoppingCart className="mr-2" />
                Pesticide Store
              </button>
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!fieldData ? (
          <div className="bg-white rounded-xl shadow-md p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">No Field Data Available</h2>
            <p className="text-gray-600 mb-4">Please add field information to see your dashboard</p>
            <Link to="/area-details">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                Add Field Information
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Field Information Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMap className="mr-2 text-green-600" />
                  Field Information
                </h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Crop Type:</span>
                    <span className="font-medium">{fieldData.cropType || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area:</span>
                    <span className="font-medium">{fieldData.area || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{fieldData.location || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Planting Date:</span>
                    <span className="font-medium">{formatDate(fieldData.plantingDate)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Expected Harvest:</span>
                    <span className="font-medium">{formatDate(fieldData.expectedHarvest)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Pesticide Pumps:</span>
                    <span className="font-medium">{fieldData.pesticidePumps || '0'}</span>
                  </div>
                </div>
              </div>

              {/* Statistics Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiBarChart2 className="mr-2 text-blue-600" />
                  Field Statistics
                </h2>
                {stats ? (
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-gray-600">Crop Health Score</span>
                        <span className="font-medium">{stats.healthScore}/100</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${stats.healthScore}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Predicted Yield:</span>
                      <span className="font-medium">{stats.predictedYield}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Treatment Effectiveness:</span>
                      <span className="font-medium">{stats.treatmentEffectiveness}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-gray-600">Risk Level:</span>
                      <span className="font-medium">{stats.riskLevel}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500">No statistics available</p>
                )}
              </div>

              {/* 3D Map Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiMap className="mr-2 text-purple-600" />
                  3D Field Health Map
                </h2>
                {render3DMap()}
                <div className="mt-4 text-sm text-gray-600">
                  <p>Visual representation of pest damage across your field. Red areas indicate higher pest concentration.</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* Pest Detection Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiAlertTriangle className="mr-2 text-red-600" />
                  Pest Detection & Analysis
                </h2>
                <div className="space-y-4">
                  {pestData && pestData.length > 0 ? (
                    <>
                      {pestData.map(pest => (
                        <div key={pest._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{pest.pestName}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(pest.severity)}`}>
                              {pest.severity}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Affected Area: {pest.affectedArea}</span>
                            <span>Detected: {formatDate(pest.detectedDate)}</span>
                          </div>
                          {pest.description && (
                            <p className="text-sm text-gray-600 mt-2">{pest.description}</p>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pest detections found</p>
                  )}
                </div>
              </div>

              {/* Pesticide Pumps Card */}
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                  <FiDroplet className="mr-2 text-blue-600" />
                  Pesticide Pump Status
                </h2>
                <div className="space-y-4">
                  {pumps && pumps.length > 0 ? (
                    <>
                      {pumps.map(pump => (
                        <div key={pump._id} className="border rounded-lg p-3">
                          <div className="flex justify-between items-center mb-2">
                            <h3 className="font-medium">{pump.pumpName}</h3>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(pump.status)}`}>
                              {pump.status}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span>Capacity: {pump.capacity}</span>
                            <span>Last Maintenance: {formatDate(pump.lastMaintenance)}</span>
                          </div>
                          {pump.location && (
                            <div className="text-sm text-gray-600 mt-1">
                              Location: {pump.location}
                            </div>
                          )}
                        </div>
                      ))}
                    </>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No pump data available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Recommended Actions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-medium text-green-800 mb-2">Immediate Treatment</h3>
                  <p className="text-sm text-green-700">Apply neem-based pesticide to affected areas within 24 hours.</p>
                </div>
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h3 className="font-medium text-yellow-800 mb-2">Schedule Maintenance</h3>
                  <p className="text-sm text-yellow-700">Check pump status and schedule maintenance as needed.</p>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-2">Preventive Measures</h3>
                  <p className="text-sm text-blue-700">Monitor field regularly and implement preventive pest control measures.</p>
                </div>
              </div>
            </div>

            {/* Weather Forecast Card */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Weather Forecast</h2>
              <div className="flex overflow-x-auto space-x-4 pb-2">
                {['Today', 'Tomorrow', 'Wed', 'Thu', 'Fri'].map((day, index) => (
                  <div key={day} className="flex-shrink-0 w-32 border rounded-lg p-3 text-center">
                    <h3 className="font-medium">{day}</h3>
                    <div className="my-2 text-3xl">🌤️</div>
                    <p className="text-sm text-gray-600">28°C / 18°C</p>
                    <p className="text-xs text-gray-500">30% rain</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;