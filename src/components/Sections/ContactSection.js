import React, { useState } from 'react';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ChatBubbleLeftRightIcon,
  PaperAirplaneIcon,
  ClockIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import Button from '../UI/Button';
import { useResponsive } from '../../hooks/useResponsive';


const ContactSection = ({ user }) => {
  const { screenSize } = useResponsive();
  const [formData, setFormData] = useState({
    name: user?.displayName || '',
    email: user?.email || '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const contactMethods = [
    {
      icon: EnvelopeIcon,
      title: 'Email Support',
      value: 'rshozab64@gmail.com',
      description: 'Get help with Xist AI features and digital safety guidance',
      available: '24/7'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: 'Live Chat',
      value: 'Available Now',
      description: 'Real-time assistance from our security experts',
      available: '9 AM - 6 PM IST'
    },
    {
      icon: PhoneIcon,
      title: 'Emergency Line',
      value: '+91 123-456-7890',
      description: 'Critical security incidents and urgent threats',
      available: '24/7'
    },
    {
      icon: MapPinIcon,
      title: 'Headquarters',
      value: 'Uttar Pradesh, INDIA',
      description: 'Get in touch with the Xist AI team',
      available: 'Mon-Fri 9-5 IST'
    }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false);
      setFormData({ ...formData, subject: '', message: '' });
      alert('Message sent successfully!');
    }, 2000);
  };

  return (
    <div className={`space-y-6 ${screenSize.isMobile ? 'px-4' : 'px-6'}`}>
      {/* Header */}
      <div className="text-center">
        <PhoneIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Get in Touch
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Have questions about digital safety? Need help with threat detection? Our security experts are here to help you stay protected.
        </p>
      </div>

      {/* Contact Methods */}
      <div className={`grid gap-6 ${screenSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
        {contactMethods.map((method, index) => {
          const IconComponent = method.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <IconComponent className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{method.title}</h3>
                  <p className="text-purple-600 font-medium mb-2">{method.value}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{method.description}</p>
                  <div className="flex items-center text-xs text-gray-500">
                    <ClockIcon className="w-3 h-3 mr-1" />
                    {method.available}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Contact Form */}
      <Card className="p-6 md:p-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Send us a Message</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`grid gap-4 ${screenSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-2'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
            >
              <option value="general">General Inquiry</option>
              <option value="technical">Technical Support</option>
              <option value="security">Security Issue</option>
              <option value="feedback">Feedback</option>
              <option value="partnership">Partnership</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({...formData, subject: e.target.value})}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              rows={6}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 text-base resize-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
              placeholder="Describe your question or concern in detail..."
              required
            />
          </div>

          <Button
            type="submit"
            loading={isSubmitting}
            icon={<PaperAirplaneIcon className="w-4 h-4" />}
            className="w-full"
          >
            {isSubmitting ? 'Sending Message...' : 'Send Message'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ContactSection;
