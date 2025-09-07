import React from "react";
import { FiDroplet } from "react-icons/fi";

const PesticidePumpStatus = ({ pumps }) => {
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status) => {
    return status === "Active"
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
        <FiDroplet className="mr-2 text-blue-600" />
        Pesticide Pump Status
      </h2>
      <div className="space-y-4">
        {pumps && pumps.length > 0 ? (
          <>
            {pumps.map((pump) => (
              <div key={pump._id} className="border rounded-lg p-3">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{pump.pumpName}</h3>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                      pump.status
                    )}`}
                  >
                    {pump.status}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Capacity: {pump.capacity}</span>
                  <span>
                    Last Maintenance: {formatDate(pump.lastMaintenance)}
                  </span>
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
          <p className="text-gray-500 text-center py-4">
            No pump data available
          </p>
        )}
      </div>
    </div>
  );
};

export default PesticidePumpStatus;