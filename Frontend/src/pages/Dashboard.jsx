import React, { useState, useEffect } from "react";
import { FiArrowRight, FiShoppingCart, FiRefreshCw } from "react-icons/fi";    
import { WiDaySunny } from 'react-icons/wi';
import { Link } from "react-router-dom";
import axios from "axios";
import WeatherForecast from "./DashboardComp/WeatherForecast";
import ThreeDMap from "./DashboardComp/ThreeDMap";
import FieldInformation from "./DashboardComp/FieldInformation";
import FieldStatistics from "./DashboardComp/FieldStatistics";
import PestDetection from "./DashboardComp/PestDetection";
import PesticidePumpStatus from "./DashboardComp/PesticidePumpStatus";

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
      const fieldResponse = await axios.get(
        "http://localhost:5000/api/fields/latest"
      );
      const fieldData = fieldResponse.data.data;
      setFieldData(fieldData);

      // Fetch pest data
      const pestResponse = await axios.get("http://localhost:5000/api/pests");
      const pestData = pestResponse.data.data || [];
      setPestData(pestData);

      // Fetch pump data
      const pumpsResponse = await axios.get("http://localhost:5000/api/pumps");
      const pumpData = pumpsResponse.data.data || [];
      setPumps(pumpData);

      // Calculate stats based on fetched data
      calculateStats(fieldData, pestData);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (fieldData, pestData) => {
    if (!fieldData) return;

    // Calculate health score based on pest severity
    let healthScore = 100;
    if (pestData && pestData.length > 0) {
      pestData.forEach((pest) => {
        if (pest.severity === "High") healthScore -= 15;
        else if (pest.severity === "Medium") healthScore -= 8;
        else if (pest.severity === "Low") healthScore -= 4;
      });
    }

    healthScore = Math.max(healthScore, 0);

    // Calculate predicted yield based on crop type and health
    let baseYield = "3.2 tons/acre";
    if (fieldData.cropType === "Rice") baseYield = "4.1 tons/acre";
    if (fieldData.cropType === "Wheat") baseYield = "3.8 tons/acre";

    // Adjust yield based on health score
    const yieldFactor = healthScore / 100;
    const predictedYield = `${(parseFloat(baseYield) * yieldFactor).toFixed(
      1
    )} tons/acre`;

    setStats({
      healthScore,
      predictedYield,
      treatmentEffectiveness: "85%",
      riskLevel:
        healthScore < 60 ? "High" : healthScore < 80 ? "Moderate" : "Low",
    });
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
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Farm Management Dashboard
          </h1>
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
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No Field Data Available
            </h2>
            <p className="text-gray-600 mb-4">
              Please add field information to see your dashboard
            </p>
            <Link to="/area-details">
              <button className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium">
                Add Field Information
              </button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              <FieldInformation fieldData={fieldData} />
              <FieldStatistics stats={stats} />
              <ThreeDMap />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <PestDetection pestData={pestData} />
              <PesticidePumpStatus pumps={pumps} />
            </div>

            {/* Weather Forecast Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <WiDaySunny className="mr-2 text-yellow-500" size="1.5rem" />
                Weather Forecast
              </h2>
              <div className="p-4">
                <WeatherForecast />
              </div>
            </div>

            {/* Recommendations Card */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-1">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Recommended Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="border rounded-lg p-4 bg-green-50">
                  <h3 className="font-medium text-green-800 mb-2">
                    Immediate Treatment
                  </h3>
                  <p className="text-sm text-green-700">
                    Apply neem-based pesticide to affected areas within 24
                    hours.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-yellow-50">
                  <h3 className="font-medium text-yellow-800 mb-2">
                    Schedule Maintenance
                  </h3>
                  <p className="text-sm text-yellow-700">
                    Check pump status and schedule maintenance as needed.
                  </p>
                </div>
                <div className="border rounded-lg p-4 bg-blue-50">
                  <h3 className="font-medium text-blue-800 mb-2">
                    Preventive Measures
                  </h3>
                  <p className="text-sm text-blue-700">
                    Monitor field regularly and implement preventive pest
                    control measures.
                  </p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
