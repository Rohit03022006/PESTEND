import React from "react";
import { FiMap } from "react-icons/fi";

const FieldInformation = ({ fieldData }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  if (!fieldData) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
          <FiMap className="mr-2 text-green-600" />
          Field Information
        </h2>
        <p className="text-gray-500">No field data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiMap className="mr-2 text-green-600" />
        Field Information
      </h2>
      <div className="space-y-3">
        <div className="flex justify-between">
          <span className="text-gray-600">Crop Type:</span>
          <span className="font-medium">{fieldData.cropType || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Area:</span>
          <span className="font-medium">{fieldData.area || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Location:</span>
          <span className="font-medium">{fieldData.location || "N/A"}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Planting Date:</span>
          <span className="font-medium">
            {formatDate(fieldData.plantingDate)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Expected Harvest:</span>
          <span className="font-medium">
            {formatDate(fieldData.expectedHarvest)}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Pesticide Pumps:</span>
          <span className="font-medium">
            {fieldData.pesticidePumps || "0"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FieldInformation;