import React from 'react';
import { motion } from 'framer-motion';
import {
  HeartIcon,
  ShieldCheckIcon,
  GlobeAltIcon,
  EnvelopeIcon,
  CodeBracketIcon,
  DocumentTextIcon,
  PhoneIcon,
  UserGroupIcon,
  LinkIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'About', href: '#about', icon: DocumentTextIcon },
    { name: 'Contact', href: '#contact', icon: EnvelopeIcon },
    { name: 'Support', href: '#support', icon: PhoneIcon },
    { name: 'Community', href: '#community', icon: UserGroupIcon },
    { name: 'API', href: '#api', icon: CodeBracketIcon }
  ];

  const socialLinks = [
    { name: 'Website', href: 'https://xistai.com', icon: GlobeAltIcon },
    { name: 'Contact', href: 'mailto:support@xistai.com', icon: EnvelopeIcon },
    { name: 'Community', href: '#community', icon: ChatBubbleLeftRightIcon },
    { name: 'API', href: '#api', icon: LinkIcon }
  ];

  return (
    <footer className="bg-gradient-to-r from-gray-900 to-gray-800 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Main Footer Content - Compact */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Brand Section */}
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <img
                src="/logo.png"
                alt="Xist AI Logo"
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg items-center justify-center hidden">
                <ShieldCheckIcon className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Xist AI
                </h3>
                <p className="text-xs text-gray-400">Advanced Detection</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-300 max-w-xs">
              AI-powered cybersecurity for everyone. Protecting digital communities through intelligent threat detection.
            </p>

            {/* Compact Stats */}
            <div className="flex space-x-4 text-xs">
              <div className="flex items-center space-x-1">
                <ShieldCheckIcon className="w-3 h-3 text-green-400" />
                <span className="font-bold text-green-400">99.7%</span>
                <span className="text-gray-400">Accuracy</span>
              </div>
              <div className="flex items-center space-x-1">
                <GlobeAltIcon className="w-3 h-3 text-blue-400" />
                <span className="font-bold text-blue-400">50K+</span>
                <span className="text-gray-400">Protected</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Quick Links</h4>
            <div className="grid grid-cols-2 gap-2">
              {quickLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors group"
                >
                  <link.icon className="w-3 h-3 text-gray-400 group-hover:text-purple-400" />
                  <span>{link.name}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Contact & Social */}
          <div className="space-y-3">
            <h4 className="font-semibold text-white text-sm">Connect</h4>
            <div className="space-y-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-white transition-colors group"
                  target={social.href.startsWith('http') ? '_blank' : undefined}
                  rel={social.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                >
                  <social.icon className="w-4 h-4 text-gray-400 group-hover:text-purple-400" />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar - Compact */}
        <div className="mt-6 pt-4 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-2 md:space-y-0">
            
            {/* Copyright */}
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <span>© {currentYear} Xist AI. All rights reserved.</span>
              <div className="flex items-center space-x-1">
                <span>Made with</span>
                <HeartIcon className="w-3 h-3 text-red-500" />
                <span>for digital safety</span>
              </div>
            </div>

            {/* Status */}
            <div className="flex items-center space-x-4 text-sm text-gray-400">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span>All systems operational</span>
              </div>
              
              <div className="flex items-center space-x-1">
                <ShieldCheckIcon className="w-3 h-3" />
                <span>99.9% Uptime</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
