import React from "react";
import { FiAlertTriangle } from "react-icons/fi";

const PestDetection = ({ pestData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case "high":
        return "bg-red-100 text-red-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiAlertTriangle className="mr-2 text-red-600" />
        Pest Detection & Analysis
      </h2>
      <div className="space-y-4">
        {pestData && pestData.length > 0 ? (
          <>
            {pestData.map((pest) => (
              <div key={pest._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{pest.pestName}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getSeverityColor(
                      pest.severity
                    )}`}
                  >
                    {pest.severity}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Affected Area: {pest.affectedArea}</span>
                  <span>Detected: {formatDate(pest.detectedDate)}</span>
                </div>
                {pest.description && (
                  <p className="text-sm text-gray-600 mt-2">
                    {pest.description}
                  </p>
                )}
              </div>
            ))}
          </>
        ) : (
          <p className="text-gray-500 text-center py-4">
            No pest detections found
          </p>
        )}
      </div>
    </div>
  );
};

export default PestDetection;