"use client";

import React, { useState } from "react";
import { Package, Truck, Box, Ship, Plane } from "lucide-react";
import FirstImage from '../assets/images/FirstImage.jpg'

const HomePage = () => {
  const [formData, setFormData] = useState({
    from: "",
    destination: "",
    type: "",
    weight: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCalculate = () => {
    console.log("Calculating shipment:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      <nav className="flex items-center justify-between px-20 py-7">
        <h1 className="text-2xl font-bold text-black tracking-wide">
          FLEXILOADS
        </h1>

        <div className="flex space-x-10 ">
          <a
            href="#about"
            className="text-[#000] text-[22px] leading-none hover:text-blue-600 transition-colors"
          >
            About
          </a>
          <a
            href="#services"
            className="text-[#000] text-[22px] leading-none hover:text-blue-600 transition-colors"
          >
            Services
          </a>
          <a
            href="#tariffs"
            className="text-[#000] text-[22px] leading-none hover:text-blue-600 transition-colors"
          >
            Tariffs
          </a>
          <a
            href="#contact"
            className="text-[#000] text-[22px] leading-none hover:text-blue-600 transition-colors"
          >
            Contact
          </a>
        </div>
      </nav>

      <main className="container mx-auto flex flex-col md:flex-row items-center justify-between px-6 py-12 min-h-[calc(100vh-112px)]">
        <div className="w-full md:w-1/2 flex justify-center order-2 md:order-1 mt-10 md:mt-0">
          <div
            className="w-[655px] h-[725px] flex-shrink-0 rounded-[30px] overflow-hidden shadow-xl bg-gray-300 bg-cover bg-no-repeat"
            style={{
                backgroundImage: `url(${FirstImage})`,
              backgroundPosition: "0px -90px",
              backgroundSize: "100% 129.389%",
            }}
          />
        </div>

        <div className="w-full md:w-1/2 space-y-8 order-1 md:order-2 md:pl-12">
          <h1 className="text-black font-inter text-[68px] font-medium leading-[80px] w-[516px] max-w-full">
            Delivering Any
            <br />
            Possibilities
            <br />
            With One Cargo
            <br />
            at a Time
          </h1>

          <div className="flex space-x-6 py-6  w-full items-center justify-between">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Package size={30} className="text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Truck size={30} className="text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Box size={30} className="text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Ship size={30} className="text-blue-600" />
              </div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center">
                <Plane size={30} className="text-blue-600" />
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Calculate your shipment
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                name="from"
                placeholder="From"
                value={formData.from}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
              <input
                type="text"
                name="destination"
                placeholder="Destination"
                value={formData.destination}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white"
              >
                <option value="">Type</option>
                <option value="standard">Standard</option>
                <option value="express">Express</option>
                <option value="overnight">Overnight</option>
              </select>
              <input
                type="text"
                name="weight"
                placeholder="kg"
                value={formData.weight}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              onClick={handleCalculate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-2xl     transition-all duration-300 shadow-md hover:shadow-lg"
            >
              Calculate
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
