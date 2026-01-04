import React from 'react';
import { HeartIcon, ShieldCheckIcon, GlobeAltIcon, CpuChipIcon, ClockIcon } from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-slate-900 text-white border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 py-5 grid grid-cols-1 md:grid-cols-3 items-center gap-8">
        {/* Brand Section */}
        <div className="flex items-center space-x-3">
          <img
            src="/logo.png"
            alt="Xist AI Logo"
            className="w-9 h-9 object-contain"
            onError={e => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
            }}
          />
          <div className="w-9 h-9 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg hidden">
            <ShieldCheckIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Xist AI
            </h3>
            <p className="text-xs text-gray-400 font-medium mt-0.5">AI Cybersecurity</p>
          </div>
        </div>

        {/* Key Platform Features */}
        <div className="flex flex-wrap gap-5 justify-center">
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <CpuChipIcon className="w-4 h-4 text-purple-400" />
            <span>Powered by DeepSeek-R1</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <ClockIcon className="w-4 h-4 text-green-400" />
            <span>24/7 Threat Monitoring</span>
          </div>
          <div className="flex items-center space-x-2 text-xs text-gray-400">
            <ShieldCheckIcon className="w-4 h-4 text-blue-400" />
            <span>98.7% Accuracy Rate</span>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col items-end md:items-end space-y-1 text-xs text-gray-500">
          <div className="flex items-center space-x-2">
            <span>© {currentYear} Xist AI.</span>
            <span className="text-gray-400">All rights reserved.</span>
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with</span>
            <HeartIcon className="w-3 h-3 text-red-500" />
            <span>for Security</span>
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <GlobeAltIcon className="w-3 h-3 text-white" />
            <span>Global Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
