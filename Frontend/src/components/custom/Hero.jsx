import React from "react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
const Hero = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-teal-50 py-8 px-4">
      <div className="flex flex-col items-center text-center py-16 px-4 sm:px-6 lg:px-8">
      <h2 className="text-5xl font-extrabold text-gray-900 sm:text-5xl dark:text-white max-w-3xl">
        Protect Your Crops with AI:
        <br />
        <strong className="text-green-600">
          {" "}
          Smart Pest & Pesticide Prediction for Farmers.
        </strong>
      </h2>

      <p className="mt-4 text-base font text-gray-700 sm:text-lg max-w-2xl dark:text-gray-300">
        Upload crop images and let AI detect pest infestations early.
        Get pesticide recommendations tailored to your crop type,
        climate, and soil conditions — reducing losses and boosting yield.
      </p>
      <Link to="/photo-upload" className="mt-8">
        <Button className="mt-5 px-6 py-6 text-xl font-semibold">
          Upload Crop Image & Detect Pest
        </Button>
      </Link>
    </div>
    </div>
  );
};

export default Hero;
