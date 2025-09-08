import React, { useState, useEffect } from 'react';
import { FiSave, FiMapPin, FiCalendar, FiDroplet, FiCrop, FiMap, FiNavigation } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AreaDetails() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    cropType: '',
    area: '',
    location: '',
    latitude: '',
    longitude: '',
    expectedHarvest: '',
    pesticidePumps: '',
    plantingDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState('');

  const cropOptions = [
    'Wheat'
  ];
  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      return;
    }

    setIsLocating(true);
    setLocationError('');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        reverseGeocode(latitude, longitude);
      },
      (error) => {
        setIsLocating(false);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError('Location access denied. Please enable location services.');
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError('Location information is unavailable.');
            break;
          case error.TIMEOUT:
            setLocationError('Location request timed out.');
            break;
          default:
            setLocationError('An unknown error occurred while getting location.');
            break;
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  const reverseGeocode = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      
      const data = await response.json();
      
      let address = '';
      if (data.address) {
        const { village, town, city, state, country } = data.address;
        address = [village, town, city, state, country].filter(Boolean).join(', ');
      }
      
      setFormData(prev => ({
        ...prev,
        location: address || `Lat: ${latitude.toFixed(6)}, Long: ${longitude.toFixed(6)}`,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }));
      
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      setFormData(prev => ({
        ...prev,
        location: `Latitude: ${latitude.toFixed(6)}, Longitude: ${longitude.toFixed(6)}`,
        latitude: latitude.toString(),
        longitude: longitude.toString()
      }));
    } finally {
      setIsLocating(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.cropType) newErrors.cropType = 'Crop type is required';
    if (!formData.area) newErrors.area = 'Area is required';
    if (!formData.location) newErrors.location = 'Location is required';
    if (!formData.expectedHarvest) newErrors.expectedHarvest = 'Expected harvest date is required';
    if (!formData.pesticidePumps) newErrors.pesticidePumps = 'Number of pesticide pumps is required';
    if (!formData.plantingDate) newErrors.plantingDate = 'Planting date is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/fields', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Data saved successfully:', response.data);
      setIsSubmitted(true);
      
      setTimeout(() => {
        navigate('/photo-upload');
      }, 1000);
      
    } catch (error) {
      console.error('Error saving data:', error);
      
      setErrors({ 
        submit: error.response?.data?.message || 'Failed to save data. Please try again.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6">
          <h1 className="text-3xl font-bold text-green-600 mb-2 text-center">Field Information Form</h1>
          <p className="text-gray-600 text-center mb-6">Please provide details about your agricultural field</p>
          
          {isSubmitted && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              Field information saved successfully! Redirecting to photo upload...
            </div>
          )}
          
          {errors.submit && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {errors.submit}
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">

            <div>
              <label htmlFor="cropType" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiCrop className="mr-2 text-green-600" />
                Crop Type <span className="text-red-500">*</span>
              </label>
              <select
                id="cropType"
                name="cropType"
                value={formData.cropType}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.cropType ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              >
                <option value="">Select Crop Type</option>
                {cropOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              {errors.cropType && <p className="text-red-500 text-sm mt-1">{errors.cropType}</p>}
            </div>
            <div>
              <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiMap className="mr-2 text-blue-600" />
                Area (acres/hectares) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="area"
                name="area"
                value={formData.area}
                onChange={handleChange}
                placeholder="e.g., 12.5 acres"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.area ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.area && <p className="text-red-500 text-sm mt-1">{errors.area}</p>}
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiMapPin className="mr-2 text-purple-600" />
                Location <span className="text-red-500">*</span>
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  disabled={isLocating || isLoading}
                  className="ml-2 flex items-center text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400"
                >
                  <FiNavigation className="mr-1" />
                  {isLocating ? 'Detecting...' : 'Use Current Location'}
                </button>
              </label>
              
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g., Coordinates or address"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              
              {isLocating && (
                <p className="text-blue-600 text-sm mt-1">Detecting your location...</p>
              )}
              
              {locationError && (
                <p className="text-red-500 text-sm mt-1">{locationError}</p>
              )}
              
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
              
              {(formData.latitude && formData.longitude) && (
                <p className="text-gray-500 text-xs mt-1">
                  Coordinates: {formData.latitude}, {formData.longitude}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="plantingDate" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiCalendar className="mr-2 text-yellow-600" />
                Planting Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="plantingDate"
                name="plantingDate"
                value={formData.plantingDate}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.plantingDate ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.plantingDate && <p className="text-red-500 text-sm mt-1">{errors.plantingDate}</p>}
            </div>
            <div>
              <label htmlFor="expectedHarvest" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiCalendar className="mr-2 text-orange-600" />
                Expected Harvest Date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="expectedHarvest"
                name="expectedHarvest"
                value={formData.expectedHarvest}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.expectedHarvest ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.expectedHarvest && <p className="text-red-500 text-sm mt-1">{errors.expectedHarvest}</p>}
            </div>

            <div>
              <label htmlFor="pesticidePumps" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                <FiDroplet className="mr-2 text-red-600" />
                Number of Pesticide Pumps <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="pesticidePumps"
                name="pesticidePumps"
                value={formData.pesticidePumps}
                onChange={handleChange}
                min="0"
                placeholder="e.g., 3"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                  errors.pesticidePumps ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={isLoading}
              />
              {errors.pesticidePumps && <p className="text-red-500 text-sm mt-1">{errors.pesticidePumps}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center transition-colors ${
                  isLoading 
                    ? 'bg-gray-400 cursor-not-allowed text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    Save Field Information
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AreaDetails;
