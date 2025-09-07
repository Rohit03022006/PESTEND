import React, { useState, useRef } from "react";
import {
  FiUploadCloud,
  FiX,
  FiImage,
  FiCheck,
  FiArrowRight,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import axios from "axios"; 

const PhotoUpload = () => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({});
  const [isUploading, setIsUploading] = useState(false);
  const [prediction, setPrediction] = useState(null); // State for prediction result
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    processFiles(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    processFiles(files);
  };

  const processFiles = (files) => {
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length === 0) return;

    setSelectedFiles((prev) => [...prev, ...validFiles]);

    const newPreviewUrls = validFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls((prev) => [...prev, ...newPreviewUrls]);

    const newProgress = {};
    validFiles.forEach((file, index) => {
      const totalIndex = selectedFiles.length + index;
      newProgress[totalIndex] = 0;

      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          const updated = { ...prev };
          if (updated[totalIndex] < 100) {
            updated[totalIndex] += 10;
          } else {
            clearInterval(interval);
          }
          return updated;
        });
      }, 200);
    });
  };

  const removeImage = (index) => {
    const newFiles = [...selectedFiles];
    const newPreviews = [...previewUrls];

    URL.revokeObjectURL(newPreviews[index]);

    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);

    const newProgress = { ...uploadProgress };
    delete newProgress[index];

    const updatedProgress = {};
    Object.entries(newProgress).forEach(([key, value]) => {
      const numKey = parseInt(key);
      updatedProgress[numKey > index ? numKey - 1 : numKey] = value;
    });

    setSelectedFiles(newFiles);
    setPreviewUrls(newPreviews);
    setUploadProgress(updatedProgress);
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const fetchPrediction = async (files) => {
    setIsUploading(true);
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/predict",  // ml model backend
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setPrediction(response.data.prediction);
      
      navigate("/dashboard", { state: { prediction: response.data } });
    } catch (error) {
      console.error("Error fetching prediction:", error);
      alert("Error processing images. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return;
    
    // Call the prediction function instead of directly navigating
    await fetchPrediction(selectedFiles);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Crop Image Analysis
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Upload images of your crops for detailed analysis and monitoring
            </p>
          </div>

          <div className="mb-8">
            <div
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-400"
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleUploadClick}
            >
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />

              <div className="max-w-md mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
                  <FiUploadCloud className="w-8 h-8 text-green-600" />
                </div>
                <p className="text-gray-700 mb-1">
                  <span className="font-medium text-green-600">
                    Click to upload
                  </span>{" "}
                  or drag and drop
                </p>
                <p className="text-sm text-gray-500">
                  PNG, JPG, JPEG up to 10MB
                </p>
              </div>
            </div>

            {previewUrls.length > 0 && (
              <div className="mt-8">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  Uploaded Images
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {previewUrls.map((url, index) => (
                    <div
                      key={index}
                      className="relative border rounded-lg overflow-hidden group transition-transform hover:scale-105"
                    >
                      <div className="h-48 bg-gray-100 overflow-hidden">
                        <img
                          src={url}
                          alt={`Preview ${index}`}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        />
                      </div>

                      {uploadProgress[index] < 100 && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gray-200 h-1.5 rounded-full">
                          <div
                            className="bg-green-600 h-1.5 rounded-full transition-all duration-300"
                            style={{ width: `${uploadProgress[index]}%` }}
                          ></div>
                        </div>
                      )}

                      <div className="absolute top-2 right-2">
                        {uploadProgress[index] === 100 ? (
                          <div className="bg-green-500 text-white rounded-full p-1 shadow-md">
                            <FiCheck className="w-3 h-3" />
                          </div>
                        ) : (
                          <div className="bg-blue-500 text-white rounded-full p-1 shadow-md animate-pulse">
                            <FiImage className="w-3 h-3" />
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        className="absolute top-2 left-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all duration-200 shadow-md"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeImage(index);
                        }}
                      >
                        <FiX className="w-3 h-3" />
                      </button>

                      <div className="p-3 bg-white">
                        <p className="text-sm font-medium text-gray-700 truncate">
                          {selectedFiles[index]?.name || `image-${index + 1}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(selectedFiles[index]?.size / 1024 / 1024).toFixed(
                            2
                          )}{" "}
                          MB
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center mt-8 pt-6 border-t border-gray-200 gap-4">
            <div className="text-center sm:text-left">
              <p className="text-sm text-gray-600">
                {selectedFiles.length}{" "}
                {selectedFiles.length === 1 ? "image" : "images"} selected
              </p>
              {selectedFiles.length > 0 && (
                <p className="text-xs text-green-600 mt-1">
                  Ready for analysis
                </p>
              )}
            </div>

            <Button
              onClick={handleSubmit}
              disabled={selectedFiles.length === 0 || isUploading}
              className="relative flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  Analyze Images
                  <FiArrowRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Tips section */}
      <div className="max-w-4xl mx-auto mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Tips for Best Results
        </h3>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <FiCheck className="w-3 h-3 text-green-600" />
            </div>
            <span>Take photos in good lighting conditions</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <FiCheck className="w-3 h-3 text-green-600" />
            </div>
            <span>Capture leaves from multiple angles</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <FiCheck className="w-3 h-3 text-green-600" />
            </div>
            <span>Include a reference object for scale</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center mt-0.5 flex-shrink-0">
              <FiCheck className="w-3 h-3 text-green-600" />
            </div>
            <span>Focus on affected areas of the plant</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoUpload;