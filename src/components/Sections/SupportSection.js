import React, { useState } from 'react';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';
import Card from '../UI/Card';
import { useResponsive } from '../../hooks/useResponsive';


const SupportSection = ({ user }) => {
  const { screenSize } = useResponsive();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState(null);

  const faqs = [
    {
      category: 'Getting Started',
      questions: [
        {
          q: 'How do I start using Xist AI?',
          a: 'Simply sign in with your Google account and start analyzing suspicious content in the Verify section. Our AI will provide instant threat detection and safety recommendations.'
        },
        {
          q: 'Is Xist AI free to use?',
          a: 'Yes! Xist AI offers comprehensive free threat detection. Premium features include advanced API access and enterprise-level security monitoring.'
        }
      ]
    },
    {
      category: 'Security & Privacy',
      questions: [
        {
          q: 'How secure is my data?',
          a: 'Your data is encrypted end-to-end and never stored permanently. We follow industry-standard security practices and never share personal information with third parties.'
        },
        {
          q: 'What data does Xist AI collect?',
          a: 'We only collect content you choose to analyze and basic usage statistics to improve our AI. No personal communications are stored or monitored.'
        }
      ]
    },
    {
      category: 'AI Analysis',
      questions: [
        {
          q: 'How accurate is the threat detection?',
          a: 'Our AI achieves 94.8% accuracy using advanced machine learning models trained on millions of threat patterns and real-time community intelligence.'
        },
        {
          q: 'What types of threats can Xist AI detect?',
          a: 'We detect phishing emails, social engineering attacks, investment scams, cryptocurrency fraud, fake news, deepfakes, malware links, and more.'
        }
      ]
    }
  ];

  const helpResources = [
    {
      title: 'User Guide',
      description: 'Complete guide to using all Xist AI features',
      icon: BookOpenIcon,
      link: '/guide'
    },
    {
      title: 'Video Tutorials',
      description: 'Step-by-step video instructions',
      icon: ChatBubbleLeftRightIcon,
      link: '/tutorials'
    },
    {
      title: 'API Documentation',
      description: 'Technical documentation for developers',
      icon: QuestionMarkCircleIcon,
      link: '/api-docs'
    }
  ];

  const toggleFaq = (categoryIndex, questionIndex) => {
    const faqId = `${categoryIndex}-${questionIndex}`;
    setExpandedFaq(expandedFaq === faqId ? null : faqId);
  };

  return (
    <div className={`space-y-6 ${screenSize.isMobile ? 'px-4' : 'px-6'}`}>
      {/* Header */}
      <div className="text-center">
        <QuestionMarkCircleIcon className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 text-purple-600" />
        <h1 className="text-2xl md:text-4xl font-bold mb-4 text-gray-900 dark:text-white">
          Help & Support Center
        </h1>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
          Find answers to common questions, browse our documentation, and get the help you need to stay protected online.
        </p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help articles, FAQs, or guides..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 dark:bg-gray-800 dark:text-white"
          />
        </div>
      </Card>

      {/* Help Resources */}
      <div className={`grid gap-6 ${screenSize.isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
        {helpResources.map((resource, index) => {
          const IconComponent = resource.icon;
          return (
            <Card key={index} className="p-6 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <div className="text-center">
                <IconComponent className="w-12 h-12 mx-auto mb-4 text-purple-600" />
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{resource.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{resource.description}</p>
              </div>
            </Card>
          );
        })}
      </div>

      {/* FAQs */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Frequently Asked Questions</h3>
        <div className="space-y-6">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h4 className="font-medium text-purple-900 dark:text-purple-200 mb-4 text-lg">
                {category.category}
              </h4>
              <div className="space-y-3">
                {category.questions.map((faq, questionIndex) => {
                  const faqId = `${categoryIndex}-${questionIndex}`;
                  const isExpanded = expandedFaq === faqId;
                  
                  return (
                    <div key={questionIndex} className="border border-gray-200 dark:border-gray-700 rounded-lg">
                      <button
                        onClick={() => toggleFaq(categoryIndex, questionIndex)}
                        className="w-full px-4 py-3 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors rounded-lg"
                      >
                        <span className="font-medium text-gray-900 dark:text-white">{faq.q}</span>
                        {isExpanded ? 
                          <ChevronDownIcon className="w-5 h-5 text-gray-500" /> : 
                          <ChevronRightIcon className="w-5 h-5 text-gray-500" />
                        }
                      </button>
                      {isExpanded && (
                        <div className="px-4 pb-3">
                          <p className="text-gray-600 dark:text-gray-400">{faq.a}</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default SupportSection;
