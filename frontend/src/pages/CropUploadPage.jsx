import React, { useState } from "react";
import { FaCamera, FaChevronUp } from "react-icons/fa";

function CropUploadPage() {
  const [file, setFile] = useState(null);
  const [cropType, setCropType] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const cropOptions = [
    "Wheat", "Corn", "Rice", "Cotton"
  ];

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith("image/")) {
      setFile(droppedFile);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const selectCropType = (crop) => {
    setCropType(crop);
    setIsDropdownOpen(false);
  };

  return (
    <div
      className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center p-4"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
            <img
        src="/logo.jpg"
        alt="Logo"
        className="absolute top-4 left-4 h-56 w-auto"
      />


      <div className="backdrop-blur-[4px] rounded-2xl p-6 w-full max-w-md shadow-lg text-center border border-white/30">

        <div className="mb-6 relative text-emerald-800">
          <div 
            className="flex items-center justify-between bg-[#a4e39a] rounded-full px-4 py-3 cursor-pointer"
            onClick={toggleDropdown}
          >
            <input
              type="text"
              placeholder="Types of Crop You are looking for"
              value={cropType}
              readOnly
              className="bg-transparent outline-none text-white w-full placeholder-green-700"
            />
            <FaChevronUp className={`text-white transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </div>
  
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white/90 backdrop-blur-md rounded-xl shadow-lg z-10 max-h-60 overflow-y-auto">
              {cropOptions.map((crop, index) => (
                <div
                  key={index}
                  className="px-4 py-3 hover:bg-green-100/50 cursor-pointer border-b border-white/20 last:border-b-0"
                  onClick={() => selectCropType(crop)}
                >
                  <span className="text-green-800">{crop}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div 
          className="border-2 border-dashed border-white/50 rounded-2xl p-6 mb-4 cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => document.getElementById('fileUpload').click()}
        >
          <input
            id="fileUpload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
          
          <div className="flex flex-col items-center justify-center">
            <FaCamera className="text-white text-2xl mb-2" />
            <p className="text-white font-semibold">Upload Photo Of Your Crop</p>
            <p className="text-white/80 text-sm mt-2 underline">drag and drop from the device</p>
          </div>
        </div>

        {file && (
          <div className="mt-4 bg-white/20 rounded-xl p-4">
            <p className="text-white text-sm mb-2">Preview:</p>
            <img
              src={URL.createObjectURL(file)}
              alt="Preview"
              className="w-full h-40 object-cover rounded-lg shadow-md"
            />
          </div>
        )}

        <button 
          className={`w-full mt-6 py-3 rounded-full font-semibold ${
            file && cropType 
              ? 'bg-orange-500 text-white hover:bg-orange-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          } transition-colors`}
          disabled={!file || !cropType}
        >
          Analyze Crop
        </button>
      </div>
    </div>
  );
}

export default CropUploadPage;