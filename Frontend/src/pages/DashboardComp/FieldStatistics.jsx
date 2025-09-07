import React from "react";
import { FiBarChart2 } from "react-icons/fi";

const FieldStatistics = ({ stats }) => {
  if (!stats) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiBarChart2 className="mr-2 text-blue-600" />
          Field Statistics
        </h2>
        <p className="text-gray-500">No statistics available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiBarChart2 className="mr-2 text-blue-600" />
        Field Statistics
      </h2>
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
    </div>
  );
};

export default FieldStatistics;